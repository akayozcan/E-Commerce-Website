package com.akay.ecommerce.service;

import com.akay.ecommerce.dto.CartItemDto;
import com.akay.ecommerce.dto.ModelConvert;
import com.akay.ecommerce.entity.Cart;
import com.akay.ecommerce.entity.CartItem;
import com.akay.ecommerce.entity.Product;
import com.akay.ecommerce.entity.User;
import com.akay.ecommerce.exception.CartNotFoundException;
import com.akay.ecommerce.exception.ProductNotFoundException;
import com.akay.ecommerce.exception.UserNotFoundException;
import com.akay.ecommerce.repository.CartItemRepository;
import com.akay.ecommerce.repository.CartRepository;
import com.akay.ecommerce.repository.ProductRepository;
import com.akay.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;

    private final CartItemRepository cartItemRepository;

    private final ProductRepository productRepository;

    private final ModelConvert modelConvert;

    private final UserRepository userRepository;


    public List<CartItemDto> getCartItems(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with user id: " + userId));

        return user.getCart().getCartItems().stream()
                .filter(cartItem -> cartItem.getProduct() != null)
                .map(modelConvert::toCartItemDto)
                .collect(Collectors.toList());
    }
    public CartItemDto saveCartItem(Integer userId, CartItemDto cartItemDto) {

        Product product = productRepository.findById(cartItemDto.getProductId())
                .orElseThrow(() -> new ProductNotFoundException("Product not found with product id: " + cartItemDto.getProductId()));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with user id: " + userId));

        Cart cart = user.getCart();

        CartItem existCartItem = cartItemRepository.findByProductAndCart(product, cart)
                .orElse(null);

        if (existCartItem != null) {
            existCartItem.setQuantity(existCartItem.getQuantity() + cartItemDto.getQuantity());
        } else {
            CartItem newCartItem = CartItem
                    .builder()
                    .cart(cart)
                    .product(product)
                    .quantity(cartItemDto.getQuantity())
                    .price(cartItemDto.getPrice())
                    .build();

            cart.getCartItems().add(newCartItem);
            product.getCartItems().add(newCartItem);
        }

        cartRepository.save(cart);
        productRepository.save(product);

        return cartItemDto;
    }


    public CartItemDto updateCartItem(Integer userId,Long productId,Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with product id: " + productId));

        User user = userRepository.findById(userId)
                .orElseThrow(()->new UserNotFoundException("User not found with user id: " + userId));

        CartItem cartItem = cartItemRepository.findByProduct(product);

        if(user.getCart().getCartItems().contains(cartItem)) {
            cartItem.setQuantity(quantity);

            CartItem savedCartItem = cartItemRepository.save(cartItem);
            //I change this line to return the savedCartItem before cartItem return
            return modelConvert.toCartItemDto(savedCartItem);
        }

        return null;
    }

    public void deleteCartItem(Integer userId, Long productId) {
        // Retrieve the product by ID, throw an exception if not found
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with product id: " + productId));

        // Retrieve the user by ID, throw an exception if not found
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with user id: " + userId));

        // Find the cart item by product and user's cart
        Cart cart = user.getCart();
        Optional<CartItem> optionalCartItem = cartItemRepository.findByProductAndCart(product, cart);

        if (optionalCartItem.isPresent()) {
            CartItem cartItem = optionalCartItem.get();

            cart.getCartItems().remove(cartItem);
            product.getCartItems().remove(cartItem);

            cartItem.setProduct(null);
            cartItem.setCart(null);

            cartRepository.save(cart);  // Update the cart first
            productRepository.save(product);  // Update the product second
            cartItemRepository.delete(cartItem);  // Delete the cart item finally
        } else {
            throw new CartNotFoundException("Cart Item cannot be found with product id: " + productId + " and user id: " + userId);
        }
    }


}
