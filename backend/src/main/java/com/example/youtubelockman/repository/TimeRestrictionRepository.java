package com.example.youtubelockman.repository;

import com.example.youtubelockman.model.TimeRestriction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TimeRestrictionRepository extends JpaRepository<TimeRestriction, Long> {
    List<TimeRestriction> findByUserId(Long userId);
    List<TimeRestriction> findByUserIdAndCategoryId(Long userId, Long categoryId);
}
