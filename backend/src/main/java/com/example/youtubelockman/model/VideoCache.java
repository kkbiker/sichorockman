package com.example.youtubelockman.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import java.io.Serializable;

@Entity
@Table(name = "video_cache")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VideoCache implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "youtube_video_id", nullable = false)
    private String youtubeVideoId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(name = "channel_title")
    private String channelTitle;

    @Column(name = "published_at")
    private String publishedAt;

    @Column(name = "cached_at", nullable = false)
    private LocalDateTime cachedAt;

    @PrePersist
    protected void onCreate() {
        cachedAt = LocalDateTime.now();
    }
}
