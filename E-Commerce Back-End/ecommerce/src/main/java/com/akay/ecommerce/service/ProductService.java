package com.akay.ecommerce.service;


import com.akay.ecommerce.dto.ModelConvert;
import com.akay.ecommerce.dto.ProductDto;
import com.akay.ecommerce.entity.*;
import com.akay.ecommerce.exception.CategoryNotFoundException;
import com.akay.ecommerce.exception.ProductNotFoundException;
import com.akay.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.SecureRandom;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    @Value("${upload.path}")
    private String uploadPath;

    private final ProductRepository productRepository;
    private  final CategoryRepository categoryRepository;
    private final ModelConvert modelConvert;
    private final OrderItemRepository orderItemRepository;
    private final CartItemRepository cartItemRepository;

    public List<ProductDto> getProducts() {
        return productRepository.findAll().stream()
                .map(modelConvert::toProductDto)
                .collect(Collectors.toList());
    }

    public ProductDto getProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with this product id" + productId));

        return modelConvert.toProductDto(product);
    }
    public ProductDto saveProduct(MultipartFile file,ProductDto productDto) {

        String generatedSku = generateSkuNumber();
        productDto.setSku(generatedSku);

        if (productRepository.findBySku(productDto.getSku()).isPresent()) {
            throw new RuntimeException("Product already exists");
        }
        Product savedProduct =  productRepository.save(modelConvert.toProduct(productDto));

        savedProduct.setImageUrl(getImageUrlForUploadProductPhoto(file));

        productRepository.save(savedProduct);

        return modelConvert.toProductDto(savedProduct);
    }

    public ProductDto updateProduct(ProductDto productDto) {
        Product product = productRepository.findBySku(productDto.getSku())
                .orElseThrow(() -> new ProductNotFoundException("Product didn't find with this Sku:" + productDto.getSku()));

        product.setTitle(productDto.getTitle());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setStock(productDto.getStock());
        //product.setImageUrl(productDto.getImageUrl());

        Product savedProduct = productRepository.save(product);
        return modelConvert.toProductDto(savedProduct);
    }

    public Page<ProductDto> getProductsPage(int page ,int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findAll(pageable)
                .map(modelConvert::toProductDto);
    }


    public Page<ProductDto> getProductsByCategoryId(int page, int size, Long categoryId) {
        Pageable pageable = PageRequest.of(page, size);

        if (!categoryRepository.existsById(categoryId)) {
            throw new CategoryNotFoundException("Category not found with this id" + categoryId);
        }
        Page<Product> productPage = productRepository.findByCategoryId(categoryId, pageable);

        return productPage.map(modelConvert::toProductDto);
    }


    public String uploadPhoto(MultipartFile file, Long productId) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("Failed to store empty file");
        }

        Path uploadDir = Paths.get(uploadPath);
        createDirectoryIfNotExists(uploadDir);

        String fileName = file.getOriginalFilename();
        Path destinationFile = uploadDir.resolve(fileName).normalize().toAbsolutePath();

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + fileName, e);
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with this id" + productId));

        String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/")
                .path(fileName)
                .toUriString();

        product.setImageUrl(imageUrl);
        productRepository.save(product);

        return fileName;
    }

    public String getImageUrlForUploadProductPhoto(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("Failed to store empty file");
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

        String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/")
                .path(fileName)
                .toUriString();

        return imageUrl;
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

    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with this sku" + productId));

        List<OrderItem> orderItems = orderItemRepository.findByProductId(productId);

        for (OrderItem orderItem : orderItems) {
            orderItem.setProduct(null);
            orderItemRepository.save(orderItem);
        }

        List<CartItem> cartItems = cartItemRepository.findByProductId(productId);

        for (CartItem cartItem : cartItems) {
            cartItem.setProduct(null);
            cartItemRepository.save(cartItem);
        }

        productRepository.delete(product);
    }

    private String generateSkuNumber() {
        String characters = "0123456789";
        StringBuilder codeBuilder = new StringBuilder();

        SecureRandom secureRandom = new SecureRandom();

        for (int i = 0; i < 6; i++) {
            int randomIndex = secureRandom.nextInt(characters.length());
            codeBuilder.append(characters.charAt(randomIndex));
        }

        return "SKU"+ codeBuilder.toString();
    }
}
