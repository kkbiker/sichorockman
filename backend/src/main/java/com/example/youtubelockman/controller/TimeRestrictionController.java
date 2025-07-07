package com.example.youtubelockman.controller;

import com.example.youtubelockman.model.TimeRestriction;
import com.example.youtubelockman.service.TimeRestrictionService;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<TimeRestriction>> getTimeRestrictions(@RequestParam(required = false) Long categoryId) {
        // Implement logic to get current user ID
        Long userId = 1L; // Dummy user ID for now
        return ResponseEntity.ok(timeRestrictionService.getTimeRestrictions(userId, categoryId));
    }

    @PostMapping
    public ResponseEntity<TimeRestriction> createTimeRestriction(@RequestBody TimeRestriction timeRestriction) {
        // Implement logic to get current user ID
        Long userId = 1L; // Dummy user ID for now
        return ResponseEntity.ok(timeRestrictionService.createTimeRestriction(userId, timeRestriction));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TimeRestriction> updateTimeRestriction(@PathVariable Long id, @RequestBody TimeRestriction timeRestriction) {
        return ResponseEntity.ok(timeRestrictionService.updateTimeRestriction(id, timeRestriction));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTimeRestriction(@PathVariable Long id) {
        timeRestrictionService.deleteTimeRestriction(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/current")
    public ResponseEntity<String> getCurrentTimeRestrictionStatus() {
        // Implement logic to get current user ID
        Long userId = 1L; // Dummy user ID for now
        return ResponseEntity.ok(timeRestrictionService.getCurrentTimeRestrictionStatus(userId));
    }
}
