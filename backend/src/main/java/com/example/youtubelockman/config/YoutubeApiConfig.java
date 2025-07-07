package com.example.youtubelockman.config;

import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.youtube.YouTube;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class YoutubeApiConfig {

    @Value("${app.youtubeApiKey}")
    private String youtubeApiKey;

    @Bean
    public YouTube youtube() {
        return new YouTube.Builder(new NetHttpTransport(), new JacksonFactory(), httpRequest -> {})
                .setApplicationName("youtube-lockman")
                .build();
    }

    public String getYoutubeApiKey() {
        return youtubeApiKey;
    }
}
