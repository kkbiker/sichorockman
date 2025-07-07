package com.example.youtubelockman.service;

import com.example.youtubelockman.model.Category;
import com.example.youtubelockman.model.TimeRestriction;
import com.example.youtubelockman.model.User;
import com.example.youtubelockman.repository.CategoryRepository;
import com.example.youtubelockman.repository.TimeRestrictionRepository;
import com.example.youtubelockman.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class TimeRestrictionService {

    private final TimeRestrictionRepository timeRestrictionRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public TimeRestrictionService(TimeRestrictionRepository timeRestrictionRepository, UserRepository userRepository, CategoryRepository categoryRepository) {
        this.timeRestrictionRepository = timeRestrictionRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<TimeRestriction> getTimeRestrictions(Long userId, Long categoryId) {
        if (categoryId != null) {
            return timeRestrictionRepository.findByUserIdAndCategoryId(userId, categoryId);
        } else {
            return timeRestrictionRepository.findByUserId(userId);
        }
    }

    public TimeRestriction createTimeRestriction(Long userId, TimeRestriction timeRestriction) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Category category = categoryRepository.findById(timeRestriction.getCategory().getId()).orElseThrow(() -> new RuntimeException("Category not found"));

        timeRestriction.setUser(user);
        timeRestriction.setCategory(category);
        return timeRestrictionRepository.save(timeRestriction);
    }

    public TimeRestriction updateTimeRestriction(Long id, TimeRestriction timeRestriction) {
        TimeRestriction existingTimeRestriction = timeRestrictionRepository.findById(id).orElseThrow(() -> new RuntimeException("Time restriction not found"));
        existingTimeRestriction.setDayOfWeek(timeRestriction.getDayOfWeek());
        existingTimeRestriction.setStartTime(timeRestriction.getStartTime());
        existingTimeRestriction.setEndTime(timeRestriction.getEndTime());
        return timeRestrictionRepository.save(existingTimeRestriction);
    }

    public void deleteTimeRestriction(Long id) {
        timeRestrictionRepository.deleteById(id);
    }

    public String getCurrentTimeRestrictionStatus(Long userId) {
        // Dummy implementation for now
        return "No active time restrictions.";
    }
}
