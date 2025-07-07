package com.example.youtubelockman.service;

import com.example.youtubelockman.config.YoutubeApiConfig;
import com.example.youtubelockman.model.VideoCache;
import com.example.youtubelockman.repository.VideoCacheRepository;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.SearchListResponse;
import com.google.api.services.youtube.model.SearchResult;
import com.google.api.services.youtube.model.VideoListResponse;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VideoService {

    private final VideoCacheRepository videoCacheRepository;
    private final YouTube youtube;
    private final YoutubeApiConfig youtubeApiConfig;

    public VideoService(VideoCacheRepository videoCacheRepository, YouTube youtube, YoutubeApiConfig youtubeApiConfig) {
        this.videoCacheRepository = videoCacheRepository;
        this.youtube = youtube;
        this.youtubeApiConfig = youtubeApiConfig;
    }

    public List<VideoCache> getVideos(Long userId, Long categoryId, String query, int page, int limit) {
        try {
            YouTube.Search.List search = youtube.search().list(List.of("id", "snippet"));
            search.setKey(youtubeApiConfig.getYoutubeApiKey());
            if (query == null || query.isEmpty()) {
                query = "React"; // Default query
            }
            search.setQ(query);
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
                                java.time.LocalDateTime.now()
                        ))
                        .collect(Collectors.toList());
            }
        } catch (IOException e) {
            e.printStackTrace();
            // Handle exception appropriately
        }
        return List.of();
    }

    public VideoCache getVideoById(String videoId) {
        try {
            YouTube.Videos.List videoList = youtube.videos().list(List.of("snippet"));
            videoList.setKey(youtubeApiConfig.getYoutubeApiKey());
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
                        java.time.LocalDateTime.now()
                );
            }
        } catch (IOException e) {
            e.printStackTrace();
            // Handle exception appropriately
        }
        return null; // Or throw an exception
    }
}
