package com.example.youtubelockman.repository;

import com.example.youtubelockman.model.TimeRestriction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TimeRestrictionRepository extends JpaRepository<TimeRestriction, Long> {
    List<TimeRestriction> findByUserId(Long userId);
    List<TimeRestriction> findByUserIdAndCategoryId(Long userId, Long categoryId);
    Optional<TimeRestriction> findByIdAndUserId(Long id, Long userId);
}
