package com.example.youtubelockman.repository;

import com.example.youtubelockman.model.Channel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChannelRepository extends JpaRepository<Channel, Long> {
    Optional<Channel> findByYoutubeChannelId(String youtubeChannelId);
}
