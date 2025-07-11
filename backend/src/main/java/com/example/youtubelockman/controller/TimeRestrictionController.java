package com.example.youtubelockman.controller;

import com.example.youtubelockman.model.TimeRestriction;
import com.example.youtubelockman.payload.TimeRestrictionRequest;
import com.example.youtubelockman.service.TimeRestrictionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/time-restrictions")
public class TimeRestrictionController {

    private final TimeRestrictionService timeRestrictionService;

    public TimeRestrictionController(TimeRestrictionService timeRestrictionService) {
        this.timeRestrictionService = timeRestrictionService;
    }

    @GetMapping
    public ResponseEntity<List<TimeRestriction>> getTimeRestrictions(@RequestParam(required = false) Long categoryId, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(timeRestrictionService.getTimeRestrictions(userDetails.getUsername(), categoryId));
    }

    @PostMapping
    public ResponseEntity<TimeRestriction> createTimeRestriction(@RequestBody TimeRestrictionRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(timeRestrictionService.createTimeRestriction(userDetails.getUsername(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TimeRestriction> updateTimeRestriction(@PathVariable Long id, @RequestBody TimeRestrictionRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(timeRestrictionService.updateTimeRestriction(id, request, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTimeRestriction(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        timeRestrictionService.deleteTimeRestriction(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/active")
    public ResponseEntity<List<TimeRestriction>> getActiveTimeRestrictions(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(timeRestrictionService.getCurrentTimeRestrictions(userDetails.getUsername()));
    }

    @GetMapping("/status")
    public ResponseEntity<List<TimeRestriction>> getCurrentTimeRestrictionStatus(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(timeRestrictionService.getCurrentTimeRestrictions(userDetails.getUsername()));
    }
}
