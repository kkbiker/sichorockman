package com.example.youtubelockman.service;

import com.example.youtubelockman.config.YoutubeApiConfig;
import com.example.youtubelockman.model.Channel;
import com.example.youtubelockman.repository.ChannelRepository;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.SearchListResponse;
import com.google.api.services.youtube.model.SearchResult;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChannelService {

    private final ChannelRepository channelRepository;
    private final YouTube youtube;
    private final YoutubeApiConfig youtubeApiConfig;

    public ChannelService(ChannelRepository channelRepository, YouTube youtube, YoutubeApiConfig youtubeApiConfig) {
        this.channelRepository = channelRepository;
        this.youtube = youtube;
        this.youtubeApiConfig = youtubeApiConfig;
    }

    @Cacheable(value = "channelSearch", key = "#query", cacheManager = "cacheManager")
    public List<Channel> searchChannels(String query) {
        try {
            YouTube.Search.List search = youtube.search().list(List.of("id", "snippet"));
            
            search.setQ(query);
            search.setType(List.of("channel"));
            search.setFields("items(id/channelId,snippet/title,snippet/description,snippet/thumbnails/default/url)");
            search.setMaxResults(5L);

            SearchListResponse searchResponse = search.execute();
            List<SearchResult> searchResultList = searchResponse.getItems();

            if (searchResultList != null) {
                return searchResultList.stream()
                        .map(result -> new Channel(
                                null,
                                result.getId().getChannelId(),
                                result.getSnippet().getTitle(),
                                result.getSnippet().getDescription(),
                                result.getSnippet().getThumbnails().getDefault().getUrl()
                        ))
                        .collect(Collectors.toList());
            }
        } catch (IOException e) {
            e.printStackTrace();
            // Handle exception appropriately
        }
        return List.of();
    }
}
