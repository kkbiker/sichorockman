package com.example.youtubelockman.controller;

import com.example.youtubelockman.model.Channel;
import com.example.youtubelockman.service.ChannelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/channels")
public class ChannelController {

    private final ChannelService channelService;

    public ChannelController(ChannelService channelService) {
        this.channelService = channelService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<Channel>> searchChannels(@RequestParam String q) {
        return ResponseEntity.ok(channelService.searchChannels(q));
    }
}
