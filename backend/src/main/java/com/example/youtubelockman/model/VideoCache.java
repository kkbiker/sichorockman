package com.example.youtubelockman.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import java.io.Serializable;

@Entity
@Table(name = "video_cache")
@Data
@NoArgsConstructor
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

    @Transient // このフィールドはデータベースに永続化しない
    private Long categoryId;

    public VideoCache(Long id, String youtubeVideoId, String title, String description, String thumbnailUrl, String channelTitle, String publishedAt, LocalDateTime cachedAt) {
        this.id = id;
        this.youtubeVideoId = youtubeVideoId;
        this.title = title;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
        this.channelTitle = channelTitle;
        this.publishedAt = publishedAt;
        this.cachedAt = cachedAt;
    }

    public VideoCache(Long id, String youtubeVideoId, String title, String description, String thumbnailUrl, String channelTitle, String publishedAt, LocalDateTime cachedAt, Long categoryId) {
        this.id = id;
        this.youtubeVideoId = youtubeVideoId;
        this.title = title;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
        this.channelTitle = channelTitle;
        this.publishedAt = publishedAt;
        this.cachedAt = cachedAt;
        this.categoryId = categoryId;
    }

    @PrePersist
    protected void onCreate() {
        cachedAt = LocalDateTime.now();
    }
}
