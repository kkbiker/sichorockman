package com.example.youtubelockman.service;

import com.example.youtubelockman.model.Category;
import com.example.youtubelockman.model.Channel;
import com.example.youtubelockman.model.User;
import com.example.youtubelockman.model.UserChannel;
import com.example.youtubelockman.repository.CategoryRepository;
import com.example.youtubelockman.repository.ChannelRepository;
import com.example.youtubelockman.repository.UserChannelRepository;
import com.example.youtubelockman.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserChannelService {

    private final UserChannelRepository userChannelRepository;
    private final UserRepository userRepository;
    private final ChannelRepository channelRepository;
    private final CategoryRepository categoryRepository;

    public UserChannelService(UserChannelRepository userChannelRepository, UserRepository userRepository, ChannelRepository channelRepository, CategoryRepository categoryRepository) {
        this.userChannelRepository = userChannelRepository;
        this.userRepository = userRepository;
        this.channelRepository = channelRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<UserChannel> getUserChannels(Long userId, Long categoryId) {
        if (categoryId != null) {
            return userChannelRepository.findByUserIdAndCategoryId(userId, categoryId);
        } else {
            return userChannelRepository.findByUserId(userId);
        }
    }

    public UserChannel addUserChannel(Long userId, UserChannel userChannel) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Channel channel = channelRepository.findById(userChannel.getChannel().getId()).orElseThrow(() -> new RuntimeException("Channel not found"));
        Category category = categoryRepository.findById(userChannel.getCategory().getId()).orElseThrow(() -> new RuntimeException("Category not found"));

        userChannel.setUser(user);
        userChannel.setChannel(channel);
        userChannel.setCategory(category);

        return userChannelRepository.save(userChannel);
    }

    public void deleteUserChannel(Long id) {
        userChannelRepository.deleteById(id);
    }
}
