package com.example.youtubelockman.repository;

import com.example.youtubelockman.model.UserChannel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserChannelRepository extends JpaRepository<UserChannel, Long> {
    List<UserChannel> findByUserId(Long userId);
    List<UserChannel> findByUserIdAndCategoryId(Long userId, Long categoryId);
    long countByUserIdAndCategoryId(Long userId, Long categoryId);
    Optional<UserChannel> findByUserIdAndChannel_YoutubeChannelId(Long userId, String youtubeChannelId);
    Optional<UserChannel> findFirstByChannelYoutubeChannelId(String youtubeChannelId);
    Optional<UserChannel> findByIdAndUserId(Long id, Long userId);
}
