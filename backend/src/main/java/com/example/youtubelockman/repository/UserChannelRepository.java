package com.example.youtubelockman.repository;

import com.example.youtubelockman.model.UserChannel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserChannelRepository extends JpaRepository<UserChannel, Long> {
    List<UserChannel> findByUserId(Long userId);
    List<UserChannel> findByUserIdAndCategoryId(Long userId, Long categoryId);
}
