package com.akay.ecommerce.controller;

import com.akay.ecommerce.dto.CategoryDto;
import com.akay.ecommerce.dto.ProductDto;
import com.akay.ecommerce.entity.Category;
import com.akay.ecommerce.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("category")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<CategoryDto>> getCategories() {
        return ResponseEntity.ok(categoryService.getCategories());
    }

    @PostMapping("/add")
    public ResponseEntity<?> addCategory(@Valid @RequestBody Category category) {
        try {
            Category savedCategory = categoryService.saveCategory(category);
            return ResponseEntity.ok(savedCategory);
        }
        catch (RuntimeException e) {
            System.err.println("Error: " + e.getMessage());
        }
        return ResponseEntity.status(400).body("Category not added successfully!");
    }

    @PostMapping("/uploadPhoto")
    public ResponseEntity<String> uploadPhoto(@RequestParam("file") MultipartFile file, @RequestParam Long categoryId) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Required part 'file' is not present or is empty");
        }
        try {
            System.out.println("File received: " + file.getOriginalFilename());
            String photoUrl = categoryService.uploadPhoto(file, categoryId);
            return ResponseEntity.ok(photoUrl);
        } catch (Exception e) {
            e.printStackTrace(); // Log the full stack trace
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/getLogo")
    public ResponseEntity<String> getLogo() {
        try {
            //System.out.println("Getting logo");
            String photoUrl = categoryService.getLogo();
            return ResponseEntity.ok(photoUrl);
        } catch (Exception e) {
            e.printStackTrace(); // Log the full stack trace
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/getTemplate")
    public ResponseEntity<String> getTemplate() {
        try {
            //System.out.println("Getting logo");
            String photoUrl = categoryService.getTemplate();
            return ResponseEntity.ok(photoUrl);
        } catch (Exception e) {
            e.printStackTrace(); // Log the full stack trace
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


}

