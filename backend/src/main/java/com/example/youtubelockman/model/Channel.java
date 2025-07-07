package com.example.youtubelockman.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.persistence.*;

@Entity
@Table(name = "channels")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Channel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "youtube_channel_id", nullable = false, unique = true)
    private String youtubeChannelId;

    @Column(nullable = false)
    private String name;

    @Column
    private String description;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

}
