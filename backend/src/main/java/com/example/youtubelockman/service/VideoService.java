package com.example.youtubelockman.service;

import com.example.youtubelockman.model.Category;
import com.example.youtubelockman.model.TimeRestriction;
import com.example.youtubelockman.model.VideoCache;
import com.example.youtubelockman.repository.VideoCacheRepository;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.SearchListResponse;
import com.google.api.services.youtube.model.SearchResult;
import com.google.api.services.youtube.model.VideoListResponse;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class VideoService {

    private static final Logger logger = LoggerFactory.getLogger(VideoService.class);

    private final VideoCacheRepository videoCacheRepository;
    private final YouTube youtube;
    private final TimeRestrictionService timeRestrictionService;
    private final UserChannelService userChannelService;

    public VideoService(VideoCacheRepository videoCacheRepository, YouTube youtube, TimeRestrictionService timeRestrictionService, UserChannelService userChannelService) {
        this.videoCacheRepository = videoCacheRepository;
        this.youtube = youtube;
        this.timeRestrictionService = timeRestrictionService;
        this.userChannelService = userChannelService;
    }

    public List<VideoCache> getVideos(String username, Long categoryId, String query, int page, int limit) {
        List<TimeRestriction> activeRestrictions = timeRestrictionService.getCurrentTimeRestrictions(username);
        boolean isCategoryRestricted = activeRestrictions.stream()
                .anyMatch(restriction -> restriction.getCategory().getId().equals(categoryId));

        if (isCategoryRestricted) {
            logger.info("VideoService - Category is restricted, returning empty list.");
            return List.of();
        }

        try {
            YouTube.Search.List search = youtube.search().list(List.of("id", "snippet"));
            
            if (categoryId != null) {
                List<String> channelIds = userChannelService.getUserChannels(username, categoryId).stream()
                        .map(userChannel -> userChannel.getChannel().getYoutubeChannelId())
                        .collect(Collectors.toList());
                logger.info("VideoService - Channel IDs for category {}: {}", categoryId, channelIds);
                if (!channelIds.isEmpty()) {
                    String joinedChannelIds = String.join(",", channelIds);
                    logger.info("VideoService - Joined Channel IDs string: {}", joinedChannelIds);
                    search.setChannelId(joinedChannelIds);
                } else {
                    return List.of();
                }
            }

            search.setOrder("date");
            if (query != null && !query.isEmpty()) {
                search.setQ(query);
            }
            search.setType(List.of("video"));
            search.setFields("items(id/videoId,snippet/title,snippet/description,snippet/thumbnails/default/url,snippet/channelTitle,snippet/publishedAt)");
            search.setMaxResults((long) limit);

            SearchListResponse searchResponse = search.execute();
            List<SearchResult> searchResultList = searchResponse.getItems();

            if (searchResultList != null) {
                return searchResultList.stream()
                        .map(result -> new VideoCache(
                                null,
                                result.getId().getVideoId(),
                                result.getSnippet().getTitle(),
                                result.getSnippet().getDescription(),
                                result.getSnippet().getThumbnails().getDefault().getUrl(),
                                result.getSnippet().getChannelTitle(),
                                result.getSnippet().getPublishedAt().toString(),
                                java.time.LocalDateTime.now(),
                                categoryId
                        ))
                        .collect(Collectors.toList());
            }
        } catch (IOException e) {
            logger.error("Error fetching videos: ", e);
        }
        return List.of();
    }

    public VideoCache getVideoById(String videoId, String username) {
        String channelId = getVideoChannelId(videoId);
        if (channelId == null) {
            logger.warn("VideoService - Could not find channel for videoId: {}", videoId);
            return null;
        }

        Optional<Category> categoryOpt = userChannelService.findCategoryForChannel(username, channelId);
        if (categoryOpt.isPresent()) {
            Category category = categoryOpt.get();
            List<TimeRestriction> activeRestrictions = timeRestrictionService.getCurrentTimeRestrictions(username);
            boolean isRestricted = activeRestrictions.stream()
                    .anyMatch(restriction -> restriction.getCategory().getId().equals(category.getId()));
            if (isRestricted) {
                logger.warn("VideoService - Access to video {} is restricted for user {}", videoId, username);
                throw new RuntimeException("This video is currently restricted.");
            }
        }

        VideoCache videoDetails = fetchVideoDetails(videoId);
        if (videoDetails != null && categoryOpt.isPresent()) {
            videoDetails.setCategoryId(categoryOpt.get().getId());
        }
        return videoDetails;
    }

    private String getVideoChannelId(String videoId) {
        try {
            YouTube.Videos.List request = youtube.videos().list(List.of("snippet"));
            request.setId(List.of(videoId));
            request.setFields("items(snippet/channelId)");
            VideoListResponse response = request.execute();
            if (response.getItems() != null && !response.getItems().isEmpty()) {
                return response.getItems().get(0).getSnippet().getChannelId();
            }
        } catch (IOException e) {
            logger.error("Error fetching channelId for video: {}", videoId, e);
        }
        return null;
    }

    @Cacheable(value = "videoDetail", key = "#videoId", cacheManager = "cacheManager")
    public VideoCache fetchVideoDetails(String videoId) {
        try {
            YouTube.Videos.List videoList = youtube.videos().list(List.of("snippet"));
            videoList.setId(List.of(videoId));
            videoList.setFields("items(id,snippet/title,snippet/description,snippet/thumbnails/default/url,snippet/channelTitle,snippet/publishedAt)");

            VideoListResponse videoListResponse = videoList.execute();
            List<com.google.api.services.youtube.model.Video> videos = videoListResponse.getItems();

            if (videos != null && !videos.isEmpty()) {
                com.google.api.services.youtube.model.Video video = videos.get(0);
                return new VideoCache(
                        null,
                        video.getId(),
                        video.getSnippet().getTitle(),
                        video.getSnippet().getDescription(),
                        video.getSnippet().getThumbnails().getDefault().getUrl(),
                        video.getSnippet().getChannelTitle(),
                        video.getSnippet().getPublishedAt().toString(),
                        java.time.LocalDateTime.now(),
                        null
                );
            }
        } catch (IOException e) {
            logger.error("Error fetching video by ID: ", e);
        }
        return null;
    }
}