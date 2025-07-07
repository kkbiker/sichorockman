package com.example.youtubelockman.controller;

import com.example.youtubelockman.model.UserChannel;
import com.example.youtubelockman.service.UserChannelService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user-channels")
public class UserChannelController {

    private final UserChannelService userChannelService;

    public UserChannelController(UserChannelService userChannelService) {
        this.userChannelService = userChannelService;
    }

    @GetMapping
    public ResponseEntity<List<UserChannel>> getUserChannels(@RequestParam(required = false) Long categoryId, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userChannelService.getUserChannels(userDetails.getUsername(), categoryId));
    }

    @PostMapping
    public ResponseEntity<UserChannel> addUserChannel(@RequestParam String youtubeChannelId, @RequestParam Long categoryId, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userChannelService.addUserChannel(userDetails.getUsername(), youtubeChannelId, categoryId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserChannel(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        userChannelService.deleteUserChannel(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
