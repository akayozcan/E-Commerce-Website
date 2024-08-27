package com.akay.ecommerce.service;

import com.akay.ecommerce.dto.FavoriteDto;
import com.akay.ecommerce.dto.ModelConvert;
import com.akay.ecommerce.dto.ProductDto;
import com.akay.ecommerce.entity.Favorite;
import com.akay.ecommerce.entity.Product;
import com.akay.ecommerce.entity.User;
import com.akay.ecommerce.exception.ProductNotFoundException;
import com.akay.ecommerce.exception.UserNotFoundException;
import com.akay.ecommerce.repository.FavoriteRepository;
import com.akay.ecommerce.repository.ProductRepository;
import com.akay.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ModelConvert modelConvert;

    @Transactional
    public FavoriteDto addProductToFavorite(Integer userId, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with this id:"+productId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with this id:"+userId));

        if (product.getId() == null) {
            throw new RuntimeException("Product must have a valid ID before being added to Favorite");
        }

        user.getFavorite().addProduct(product);
        Favorite savedFavorite = favoriteRepository.save(user.getFavorite());

        return modelConvert.toFavoriteDto(savedFavorite);
    }

    public void removeProductFromFavorite(Integer userId, Long productId) {
        Optional<Product> product = Optional.ofNullable(productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found  with this id:"+productId)));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with this id:"+userId));

        user.getFavorite().removeProduct(product.get());

        favoriteRepository.save(user.getFavorite());
    }

    public List<ProductDto> getFavoriteProducts(Integer userId) {
        User user = userRepository.findById(userId).
                orElseThrow(()-> new UserNotFoundException("User not found with this id:"+userId));

        return user.getFavorite().getProducts()
                .stream()
                .map(modelConvert::toProductDto)
                .collect(Collectors.toList());
    }

    public boolean isFavorite(Integer userId,Long productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with this id:"+userId));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with this id:"+productId));


        boolean isFavorite = user.getFavorite().getProducts().contains(product);

        return isFavorite;
    }
}
