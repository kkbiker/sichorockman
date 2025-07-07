package com.example.youtubelockman.controller;

import com.example.youtubelockman.model.UserChannel;
import com.example.youtubelockman.service.UserChannelService;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<UserChannel>> getUserChannels(@RequestParam(required = false) Long categoryId) {
        // Implement logic to get current user ID
        Long userId = 1L; // Dummy user ID for now
        return ResponseEntity.ok(userChannelService.getUserChannels(userId, categoryId));
    }

    @PostMapping
    public ResponseEntity<UserChannel> addUserChannel(@RequestBody UserChannel userChannel) {
        // Implement logic to get current user ID
        Long userId = 1L; // Dummy user ID for now
        return ResponseEntity.ok(userChannelService.addUserChannel(userId, userChannel));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserChannel(@PathVariable Long id) {
        userChannelService.deleteUserChannel(id);
        return ResponseEntity.noContent().build();
    }
}
