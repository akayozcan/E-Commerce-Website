package com.akay.ecommerce.repository;

import com.akay.ecommerce.entity.Cart;
import com.akay.ecommerce.entity.CartItem;
import com.akay.ecommerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    public CartItem findByProduct(Product product);
    public List<CartItem> findByProductId(Long productId);
    Optional<CartItem> findByProductAndCart(Product product, Cart cart);

}