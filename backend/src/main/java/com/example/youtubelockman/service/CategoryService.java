package com.example.youtubelockman.service;

import com.example.youtubelockman.model.Category;
import com.example.youtubelockman.model.User;
import com.example.youtubelockman.repository.CategoryRepository;
import com.example.youtubelockman.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public CategoryService(CategoryRepository categoryRepository, UserRepository userRepository) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    public List<Category> getAllCategories(String username) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("User not found"));
        return categoryRepository.findByUserId(user.getId());
    }

    public Category createCategory(Category category, String username) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("User not found"));
        category.setUser(user);
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, Category category, String username) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("User not found"));
        Category existingCategory = categoryRepository.findByIdAndUserId(id, user.getId()).orElseThrow(() -> new RuntimeException("Category not found"));
        existingCategory.setName(category.getName());
        existingCategory.setChannelLimit(category.getChannelLimit());
        return categoryRepository.save(existingCategory);
    }

    public void deleteCategory(Long id, String username) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("User not found"));
        Category category = categoryRepository.findByIdAndUserId(id, user.getId()).orElseThrow(() -> new RuntimeException("Category not found"));
        categoryRepository.delete(category);
    }
}
