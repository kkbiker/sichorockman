package com.example.youtubelockman.service;

import com.example.youtubelockman.model.Category;
import com.example.youtubelockman.model.TimeRestriction;
import com.example.youtubelockman.model.User;
import com.example.youtubelockman.payload.TimeRestrictionRequest;
import com.example.youtubelockman.repository.CategoryRepository;
import com.example.youtubelockman.repository.TimeRestrictionRepository;
import com.example.youtubelockman.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TimeRestrictionService {

    private static final Logger logger = LoggerFactory.getLogger(TimeRestrictionService.class);

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

    public TimeRestriction createTimeRestriction(String username, TimeRestrictionRequest request) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("User not found"));
        Category category = categoryRepository.findById(request.getCategoryId()).orElseThrow(() -> new RuntimeException("Category not found"));

        TimeRestriction timeRestriction = new TimeRestriction();
        timeRestriction.setUser(user);
        timeRestriction.setCategory(category);
        timeRestriction.setDayOfWeek(request.getDayOfWeek());
        timeRestriction.setStartTime(LocalTime.parse(request.getStartTime()));
        timeRestriction.setEndTime(LocalTime.parse(request.getEndTime()));

        return timeRestrictionRepository.save(timeRestriction);
    }

    public TimeRestriction updateTimeRestriction(Long id, TimeRestrictionRequest request, String username) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("User not found"));
        TimeRestriction existingTimeRestriction = timeRestrictionRepository.findByIdAndUserId(id, user.getId()).orElseThrow(() -> new RuntimeException("Time restriction not found"));
        Category category = categoryRepository.findById(request.getCategoryId()).orElseThrow(() -> new RuntimeException("Category not found"));

        existingTimeRestriction.setCategory(category);
        existingTimeRestriction.setDayOfWeek(request.getDayOfWeek());
        existingTimeRestriction.setStartTime(LocalTime.parse(request.getStartTime()));
        existingTimeRestriction.setEndTime(LocalTime.parse(request.getEndTime()));
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

        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Tokyo")); // JSTで現在時刻を取得
        DayOfWeek currentDayOfWeek = now.getDayOfWeek();
        LocalTime currentTime = now.toLocalTime();

        logger.info("Current Time (JST): {}", now);
        logger.info("Current Day of Week: {}", currentDayOfWeek);
        logger.info("Current Time (LocalTime): {}", currentTime);
        logger.info("All Restrictions for user: {}", allRestrictions);

        List<TimeRestriction> filteredRestrictions = allRestrictions.stream()
                .filter(restriction -> restriction.getCategory() != null)
                .filter(restriction -> restriction.getDayOfWeek() == currentDayOfWeek.getValue())
                .filter(restriction -> {
                    LocalTime startTime = restriction.getStartTime();
                    LocalTime endTime = restriction.getEndTime();
                    boolean isRestricted;
                    if (startTime.isBefore(endTime)) {
                        isRestricted = currentTime.isAfter(startTime) && currentTime.isBefore(endTime);
                    } else { // Handles overnight restrictions (e.g., 22:00 - 06:00)
                        isRestricted = currentTime.isAfter(startTime) || currentTime.isBefore(endTime);
                    }
                    logger.info("  Restriction: {}, Day: {}, Start: {}, End: {}, Is Restricted: {}",
                            restriction.getCategory().getName(), restriction.getDayOfWeek(), startTime, endTime, isRestricted);
                    return isRestricted;
                })
                .collect(Collectors.toList());

        logger.info("Active Restrictions after filtering: {}", filteredRestrictions);
        return filteredRestrictions;
    }
}