package com.example.youtubelockman.controller;

import com.example.youtubelockman.model.Category;
import com.example.youtubelockman.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(categoryService.getAllCategories(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(categoryService.createCategory(category, userDetails.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category category, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(categoryService.updateCategory(id, category, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        categoryService.deleteCategory(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
