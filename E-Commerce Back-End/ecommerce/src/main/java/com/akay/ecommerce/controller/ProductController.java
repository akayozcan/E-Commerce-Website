package com.akay.ecommerce.controller;

import com.akay.ecommerce.dto.ProductDto;
import com.akay.ecommerce.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;


@RestController
@RequestMapping("product")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<ProductDto>> getProducts() {
        return ResponseEntity.ok(productService.getProducts());
    }

    @GetMapping("/getProduct")
    public ResponseEntity<ProductDto> getProduct(@RequestParam Long productId) {
        try {
            ProductDto productDto = productService.getProduct(productId);
            return ResponseEntity.ok(productDto);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> addProduct(@RequestParam("file") MultipartFile file, @RequestParam("productDto") String productDtoString) {
        try {
            // Convert JSON string to ProductDto
            ObjectMapper objectMapper = new ObjectMapper();
            ProductDto productDto = objectMapper.readValue(productDtoString, ProductDto.class);

            ProductDto savedProductDto = productService.saveProduct(file, productDto);
            return ResponseEntity.ok(savedProductDto);
        } catch (RuntimeException | IOException e) {
            System.err.println("Error: " + e.getMessage());
            return ResponseEntity.status(400).body("Product not added");
        }
    }

    @PutMapping("/updateProduct")
    public ResponseEntity<?> updateProductInfo(@RequestBody ProductDto productDto) {
        try {
            ProductDto returnProductDto = productService.updateProduct(productDto);
            return ResponseEntity.ok(returnProductDto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Product cannot found!");
        }
    }


    @GetMapping("/getPage")
    public ResponseEntity<Page<ProductDto>> getProductsPage(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size)
    {
        Page<ProductDto> products = productService.getProductsPage(page,size);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/getProductsByCategoryId")
    public ResponseEntity<Page<ProductDto>> getCategoriesPage(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam Long categoryId)
    {
        try {
            Page<ProductDto> productDtos= productService.getProductsByCategoryId(page, size,categoryId);
            return ResponseEntity.ok(productDtos);
        } catch (Exception e) {
            e.printStackTrace(); // Log the full stack trace
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/uploadPhoto")
    public ResponseEntity<String> uploadPhoto(@RequestParam("file") MultipartFile file, @RequestParam Long productId) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Required part 'file' is not present or is empty");
        }
        try {
            String photoUrl = productService.uploadPhoto(file, productId);
            return ResponseEntity.ok(photoUrl);
        } catch (Exception e) {
            e.printStackTrace(); // Log the full stack trace
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping
    public void deleteProduct(@RequestParam Long productId) {
        productService.deleteProduct(productId);
    }
}
