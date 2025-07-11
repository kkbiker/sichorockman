package com.example.youtubelockman.controller;

import com.example.youtubelockman.model.VideoCache;
import com.example.youtubelockman.service.VideoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/videos")
public class VideoController {

    private final VideoService videoService;

    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }

    @GetMapping
    public ResponseEntity<List<VideoCache>> getVideos(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(videoService.getVideos(userDetails.getUsername(), categoryId, q, page, limit));
    }

    @GetMapping("/{videoId}")
    public ResponseEntity<VideoCache> getVideoById(@PathVariable String videoId, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(videoService.getVideoById(videoId, userDetails.getUsername()));
    }
}
