package com.akay.ecommerce.service;

import com.akay.ecommerce.dto.CategoryDto;
import com.akay.ecommerce.dto.ModelConvert;
import com.akay.ecommerce.entity.Category;
import com.akay.ecommerce.exception.CategoryNotFoundException;
import com.akay.ecommerce.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    private final ModelConvert modelConvert;

    @Value("${upload.path}")
    private String uploadPath;

    public CategoryService(CategoryRepository categoryRepository,
                           ModelConvert modelConvert) {
        this.categoryRepository = categoryRepository;
        this.modelConvert = modelConvert;
    }

    public List<CategoryDto> getCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(modelConvert::toCategoryDto)
                .collect(Collectors.toList());
    }

    public Category saveCategory(Category category) {
        if (categoryRepository.findById(category.getId()).isPresent()) {
            throw new RuntimeException("Category already exists with id: " + category.getId());
        }
        return categoryRepository.save(category);
    }

    public String uploadPhoto(MultipartFile file, Long categoryId) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("Failed to store empty file!");
        }
        // Ensure the directory exists
        Path uploadDir = Paths.get(uploadPath);
        createDirectoryIfNotExists(uploadDir);

        String fileName = file.getOriginalFilename();
        Path destinationFile = uploadDir.resolve(fileName).normalize().toAbsolutePath();

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + fileName, e);
        }

        // Store only the filename in the database
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with id: " + categoryId));

        String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/")
                .path(fileName)
                .toUriString();
        category.setImageURL(imageUrl);

        categoryRepository.save(category);

        return fileName;
    }

    private void createDirectoryIfNotExists(Path path) {
        if (!Files.exists(path)) {
            try {
                Files.createDirectories(path);
            } catch (IOException e) {
                throw new RuntimeException("Could not create upload directory", e);
            }
        }
    }

    public String getLogo() {
        String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/")
                .path("logo.png")
                .toUriString();

        //System.out.println("Logo URL: " + imageUrl);
        return imageUrl;
    }

    public String getTemplate() {
        String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/")
                .path("template2.png")
                .toUriString();

        //System.out.println("Template URL: " + imageUrl);

        return imageUrl;
    }

    public void initializeCategories() {
        if (categoryRepository.count() == 0) {
            Category electronics = new Category();
            electronics.setTitle("Electronics");
            electronics.setImageURL("http://localhost:8080/api/v1/uploads/electronic.jpg");
            categoryRepository.save(electronics);

            Category fashion = new Category();
            fashion.setTitle("Fashion");
            fashion.setImageURL("http://localhost:8080/api/v1/uploads/fashion.png");
            categoryRepository.save(fashion);

            Category home_and_kitchen = new Category();
            home_and_kitchen.setTitle("Home and Kitchen");
            home_and_kitchen.setImageURL("http://localhost:8080/api/v1/uploads/home.jpg");
            categoryRepository.save(home_and_kitchen);

            Category sports_and_outdoors = new Category();
            sports_and_outdoors.setTitle("Sports and Outdoors");
            sports_and_outdoors.setImageURL("http://localhost:8080/api/v1/uploads/sport.jpeg");
            categoryRepository.save(sports_and_outdoors);

            Category health_and_beauty = new Category();
            health_and_beauty.setTitle("Health and Beauty");
            health_and_beauty.setImageURL("http://localhost:8080/api/v1/uploads/health.png");
            categoryRepository.save(health_and_beauty);

            Category toys_and_games = new Category();
            toys_and_games.setTitle("Toys and Games");
            toys_and_games.setImageURL("http://localhost:8080/api/v1/uploads/toy.jpeg");
            categoryRepository.save(toys_and_games);

            Category books = new Category();
            books.setTitle("Books");
            books.setImageURL("http://localhost:8080/api/v1/uploads/book.jpg");
            categoryRepository.save(books);

            Category automotive = new Category();
            automotive.setTitle("Automotive");
            automotive.setImageURL("http://localhost:8080/api/v1/uploads/car.png");
            categoryRepository.save(automotive);

        }


    }
}

