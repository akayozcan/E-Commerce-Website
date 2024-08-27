package com.akay.ecommerce.controller;

import com.akay.ecommerce.dto.FavoriteDto;
import com.akay.ecommerce.dto.ProductDto;
import com.akay.ecommerce.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("favorite")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    //Add product to favorite
    @PostMapping("/add")
    public ResponseEntity<FavoriteDto> addProductToFavorite(
            @RequestParam Integer userId,
            @RequestParam Long productId
    ) {
        try {
            FavoriteDto favoriteDto = favoriteService.addProductToFavorite(userId, productId);
            return ResponseEntity.ok(favoriteDto);
        } catch (RuntimeException e) {
           return ResponseEntity.status(400).body(null);
        }
    }


    //Remove product from favorite

    @DeleteMapping("/remove")
    public void removeProductFromFavorite(
            @RequestParam Integer userId,
            @RequestParam Long productId
    ) {
        try {
            favoriteService.removeProductFromFavorite(userId, productId);
        } catch (RuntimeException e) {
            System.err.println("Error: " + e.getMessage());
        }
    }

    //Get all favorite products

    @GetMapping("/get")
    public List<ProductDto> getFavoriteProducts(
            @RequestParam Integer userId
    ) {
        return favoriteService.getFavoriteProducts(userId);
    }

    @GetMapping("/isFavorite")
    public boolean isFavorite(
            @RequestParam Integer userId,
            @RequestParam Long productId
    ) {
        return favoriteService.isFavorite(userId, productId);
    }
}
