package com.example.youtubelockman.service;

import com.example.youtubelockman.model.Category;
import com.example.youtubelockman.model.TimeRestriction;
import com.example.youtubelockman.model.User;
import com.example.youtubelockman.payload.TimeRestrictionRequest; // 追加
import com.example.youtubelockman.repository.CategoryRepository;
import com.example.youtubelockman.repository.TimeRestrictionRepository;
import com.example.youtubelockman.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

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

    public List<TimeRestriction> getTimeRestrictions(String username, Long categoryId) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("User not found"));
        if (categoryId != null) {
            return timeRestrictionRepository.findByUserIdAndCategoryId(user.getId(), categoryId);
        } else {
            return timeRestrictionRepository.findByUserId(user.getId());
        }
    }

    public TimeRestriction createTimeRestriction(String username, TimeRestrictionRequest request) { // 変更
        User user = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("User not found"));
        Category category = categoryRepository.findById(request.getCategoryId()).orElseThrow(() -> new RuntimeException("Category not found")); // 変更

        TimeRestriction timeRestriction = new TimeRestriction(); // 新しいTimeRestrictionオブジェクトを作成
        timeRestriction.setUser(user);
        timeRestriction.setCategory(category);
        timeRestriction.setDayOfWeek(request.getDayOfWeek());
        timeRestriction.setStartTime(request.getStartTime());
        timeRestriction.setEndTime(request.getEndTime());

        return timeRestrictionRepository.save(timeRestriction);
    }

    public TimeRestriction updateTimeRestriction(Long id, TimeRestrictionRequest request, String username) { // 変更
        User user = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("User not found"));
        TimeRestriction existingTimeRestriction = timeRestrictionRepository.findByIdAndUserId(id, user.getId()).orElseThrow(() -> new RuntimeException("Time restriction not found"));
        Category category = categoryRepository.findById(request.getCategoryId()).orElseThrow(() -> new RuntimeException("Category not found")); // 変更

        existingTimeRestriction.setCategory(category); // カテゴリも更新できるように追加
        existingTimeRestriction.setDayOfWeek(request.getDayOfWeek());
        existingTimeRestriction.setStartTime(request.getStartTime());
        existingTimeRestriction.setEndTime(request.getEndTime());
        return timeRestrictionRepository.save(existingTimeRestriction);
    }

    public void deleteTimeRestriction(Long id, String username) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("User not found"));
        TimeRestriction timeRestriction = timeRestrictionRepository.findByIdAndUserId(id, user.getId()).orElseThrow(() -> new RuntimeException("Time restriction not found"));
        timeRestrictionRepository.delete(timeRestriction);
    }

    public List<TimeRestriction> getCurrentTimeRestrictions(String username) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("User not found"));
        List<TimeRestriction> allRestrictions = timeRestrictionRepository.findByUserId(user.getId());

        LocalDateTime now = LocalDateTime.now();
        DayOfWeek currentDayOfWeek = now.getDayOfWeek();
        LocalTime currentTime = now.toLocalTime();

        return allRestrictions.stream()
                .filter(restriction -> restriction.getCategory() != null)
                .filter(restriction -> restriction.getDayOfWeek() == currentDayOfWeek.getValue())
                .filter(restriction -> {
                    LocalTime startTime = restriction.getStartTime();
                    LocalTime endTime = restriction.getEndTime();
                    // Check if current time is within the restriction period
                    if (startTime.isBefore(endTime)) {
                        return !currentTime.isBefore(startTime) && !currentTime.isAfter(endTime);
                    } else { // Handles overnight restrictions (e.g., 22:00 - 06:00)
                        return !currentTime.isBefore(startTime) || !currentTime.isAfter(endTime);
                    }
                })
                .collect(Collectors.toList());
    }
}
