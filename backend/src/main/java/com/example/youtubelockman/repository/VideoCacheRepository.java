package com.example.youtubelockman.repository;

import com.example.youtubelockman.model.VideoCache;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VideoCacheRepository extends JpaRepository<VideoCache, Long> {
}
