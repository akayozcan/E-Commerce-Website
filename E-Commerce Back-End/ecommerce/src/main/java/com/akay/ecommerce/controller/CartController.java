package com.akay.ecommerce.controller;

import com.akay.ecommerce.dto.CartItemDto;
import com.akay.ecommerce.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }


    @GetMapping
    public ResponseEntity<List<CartItemDto>> getCartItems(@RequestParam Integer userId) {
        try {
            List<CartItemDto> cartItems = cartService.getCartItems(userId);
            return ResponseEntity.ok(cartItems);
        } catch (RuntimeException e) {
            System.err.println("Error: " + e.getMessage());
            return ResponseEntity.status(400).body(null);
        }
    }


    @PostMapping("/add")
    public ResponseEntity<CartItemDto> addCartItem(@RequestBody CartItemDto cartItemDto,@RequestParam Integer userId) {
        try {
            CartItemDto savedCartItemDto = cartService.saveCartItem(userId,cartItemDto);
            return ResponseEntity.ok(savedCartItemDto);
        } catch (RuntimeException e) {
            System.err.println("Error: " + e.getMessage());
            return ResponseEntity.status(400).body(null);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<CartItemDto> updateCartItem(@RequestParam Integer userId,@RequestParam Long productId, @RequestParam Integer quantity) {
        try {
            CartItemDto updatedCartItemDto = cartService.updateCartItem(userId,productId, quantity);
            return ResponseEntity.ok(updatedCartItemDto);
        } catch (RuntimeException e) {
            System.err.println("Error: " + e.getMessage());
            return ResponseEntity.status(400).body(null);
        }
    }

    @DeleteMapping()
    public ResponseEntity<?> deleteCartItem(@RequestParam Integer userId,@RequestParam Long productId) {
        try {
            cartService.deleteCartItem(userId,productId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            System.err.println("Error: " + e.getMessage());
            return ResponseEntity.status(400).body(null);
        }
    }

}
