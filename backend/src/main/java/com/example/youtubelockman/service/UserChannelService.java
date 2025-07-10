package com.example.youtubelockman.service;

import com.example.youtubelockman.model.Category;
import com.example.youtubelockman.model.Channel;
import com.example.youtubelockman.model.User;
import com.example.youtubelockman.model.UserChannel;
import com.example.youtubelockman.repository.CategoryRepository;
import com.example.youtubelockman.repository.ChannelRepository;
import com.example.youtubelockman.repository.UserChannelRepository;
import com.example.youtubelockman.repository.UserRepository;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.ChannelListResponse;
import com.google.api.services.youtube.model.ChannelSnippet;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserChannelService {

    private final UserChannelRepository userChannelRepository;
    private final UserRepository userRepository;
    private final ChannelRepository channelRepository;
    private final CategoryRepository categoryRepository;
    private final YouTube youtube;

    public UserChannelService(UserChannelRepository userChannelRepository, UserRepository userRepository, ChannelRepository channelRepository, CategoryRepository categoryRepository, YouTube youtube) {
        this.userChannelRepository = userChannelRepository;
        this.userRepository = userRepository;
        this.channelRepository = channelRepository;
        this.categoryRepository = categoryRepository;
        this.youtube = youtube;
    }

    public List<UserChannel> getUserChannels(String username, Long categoryId) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("User not found"));
        if (categoryId != null) {
            return userChannelRepository.findByUserIdAndCategoryId(user.getId(), categoryId);
        } else {
            return userChannelRepository.findByUserId(user.getId());
        }
    }

    public UserChannel addUserChannel(String username, String youtubeChannelId, Long categoryId) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("User not found"));
        Category category = categoryRepository.findByIdAndUserId(categoryId, user.getId()).orElseThrow(() -> new RuntimeException("Category not found or not owned by user"));

        // カテゴリのチャンネル上限チェック
        long currentChannelCount = userChannelRepository.countByUserIdAndCategoryId(user.getId(), categoryId);
        if (currentChannelCount >= category.getChannelLimit()) {
            throw new RuntimeException("Channel limit reached for this category.");
        }

        // チャンネルが既に登録されているかチェック
        Optional<UserChannel> existingUserChannel = userChannelRepository.findByUserIdAndChannel_YoutubeChannelId(user.getId(), youtubeChannelId);
        if (existingUserChannel.isPresent()) {
            throw new RuntimeException("Channel already registered for this user.");
        }

        // YouTube APIからチャンネル情報を取得
        Channel youtubeChannel = getChannelDetailsFromYoutube(youtubeChannelId);
        if (youtubeChannel == null) {
            throw new RuntimeException("YouTube channel not found or invalid ID.");
        }

        // Channelエンティティを保存または取得
        Channel channel = channelRepository.findByYoutubeChannelId(youtubeChannelId)
                .orElseGet(() -> {
                    return channelRepository.save(youtubeChannel);
                });

        UserChannel userChannel = new UserChannel();
        userChannel.setUser(user);
        userChannel.setChannel(channel);
        userChannel.setCategory(category);
        userChannel.setCreatedAt(LocalDateTime.now());

        return userChannelRepository.save(userChannel);
    }

    public void deleteUserChannel(Long id, String username) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("User not found"));
        UserChannel userChannel = userChannelRepository.findByIdAndUserId(id, user.getId()).orElseThrow(() -> new RuntimeException("User channel not found or not owned by user"));
        userChannelRepository.delete(userChannel);
    }

    public Optional<Category> findCategoryForChannel(String username, String youtubeChannelId) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("User not found"));
        return userChannelRepository.findByUserIdAndChannel_YoutubeChannelId(user.getId(), youtubeChannelId)
                .map(UserChannel::getCategory);
    }

    @Cacheable(value = "channelDetail", key = "#youtubeChannelId", cacheManager = "cacheManager")
    private Channel getChannelDetailsFromYoutube(String youtubeChannelId) {
        try {
            YouTube.Channels.List channelList = youtube.channels().list(List.of("snippet", "statistics"));
            channelList.setId(List.of(youtubeChannelId));
            channelList.setFields("items(id,snippet/title,snippet/description,snippet/thumbnails/default/url,statistics/subscriberCount,statistics/videoCount)");

            ChannelListResponse response = channelList.execute();
            if (response.getItems() != null && !response.getItems().isEmpty()) {
                com.google.api.services.youtube.model.Channel youtubeChannel = response.getItems().get(0);
                ChannelSnippet snippet = youtubeChannel.getSnippet();

                return new Channel(
                        null, // IDは自動生成
                        youtubeChannel.getId(),
                        snippet.getTitle(),
                        snippet.getDescription(),
                        snippet.getThumbnails().getDefault().getUrl(),
                        youtubeChannel.getStatistics() != null ? youtubeChannel.getStatistics().getSubscriberCount().longValue() : 0L,
                        youtubeChannel.getStatistics() != null ? youtubeChannel.getStatistics().getVideoCount().longValue() : 0L
                );
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
}
