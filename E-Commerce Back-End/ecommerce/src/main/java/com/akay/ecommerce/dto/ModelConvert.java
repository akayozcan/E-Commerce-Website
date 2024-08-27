package com.akay.ecommerce.dto;

import com.akay.ecommerce.entity.*;
import com.akay.ecommerce.repository.*;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ModelConvert {

    private final CategoryRepository categoryRepository;
    private final VendorRepository vendorRepository;

    private final CartRepository cartRepository;

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public ModelConvert(CategoryRepository categoryRepository,
                        VendorRepository vendorRepository,
                        CartRepository cartRepository,
                        ProductRepository productRepository,
                        OrderRepository orderRepository) {
        this.categoryRepository = categoryRepository;
        this.vendorRepository = vendorRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }
    public UserInfoResponse toUserInfoResponse(User user) {
        return UserInfoResponse.builder()
                .firstname(user.getFirstName())
                .lastname(user.getLastName())
                .email(user.getEmail())
                .password(user.getPassword())
                .phone(user.getPhone())
                .dateOfBirth(user.getDateOfBirth())
                .build();
    }

    public ProductDto toProductDto(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .title(product.getTitle())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .sku(product.getSku())
                .imageUrl(product.getImageUrl())
                .categoryId(product.getCategory().getId())
                .vendorId(product.getVendor().getId())
                .build();
    }

    public Product toProduct(ProductDto productDto) {

        Category category = categoryRepository.findById(productDto.getCategoryId())
                .orElseThrow(() -> new NoSuchElementException("Category not found"));

        System.out.println("\nCategory: \n " + category.getTitle());

        Vendor vendor = vendorRepository.findById(productDto.getVendorId())
                .orElseThrow(() -> new NoSuchElementException("Vendor not found"));

        System.out.println("\nVendor: \n " + vendor.getName());
        ;

        return Product.builder()
                .title(productDto.getTitle())
                .description(productDto.getDescription())
                .price(productDto.getPrice())
                .stock(productDto.getStock())
                .sku(productDto.getSku())
                .imageUrl(productDto.getImageUrl())
                .category(category)
                .vendor(vendor)
                .build();
    }

    public CategoryDto toCategoryDto(Category category) {
        return CategoryDto.builder()
                .id(category.getId())
                .title(category.getTitle())
                .imageURL(category.getImageURL())
                .build();
    }

    public FavoriteDto toFavoriteDto(Favorite favorite) {
        return FavoriteDto.builder()
                .id(favorite.getId())
                .build();
    }

    public CartItemDto toCartItemDto(CartItem cartItem) {
       // System.out.println("cartItem.getProduct().getId() =>" + cartItem.getProduct().getId());
        if (cartItem.getProduct() == null) {
            throw new RuntimeException("Product in CartItem is null");
        }
        return CartItemDto.builder()
                .cartId(cartItem.getCart().getId())
                .productId(cartItem.getProduct().getId())
                .quantity(cartItem.getQuantity())
                .price(cartItem.getPrice())
                .build();
    }

    public CartItem toCartItem(CartItemDto cartItemDto) {
        Product product = productRepository.findById(cartItemDto.getProductId())
                .orElseThrow(() -> new NoSuchElementException("Product not found"));

        Cart cart = cartRepository.findById(cartItemDto.getCartId())
                .orElseThrow(() -> new NoSuchElementException("Cart not found"));

        return CartItem.builder()
                .cart(cart)
                .product(product)
                .quantity(cartItemDto.getQuantity())
                .price(cartItemDto.getPrice())
                .build();
    }

    public OrderItemDto toOrderItemDto(OrderItem orderItem) {
        if (orderItem.getProduct() == null) {
            throw new RuntimeException("Product in CartItem is null");
        }
        return OrderItemDto.builder()
                .orderId(orderItem.getOrder().getId())
                .productId(orderItem.getProduct().getId())
                .quantity(orderItem.getQuantity())
                .price(orderItem.getPrice())
                .build();
    }

    public OrderItem toOrderItem(OrderItemDto orderItemDto) {
        Product product = productRepository.findById(orderItemDto.getProductId())
                .orElseThrow(() -> new NoSuchElementException("Product not found"));

        Order order = orderRepository.findById(orderItemDto.getOrderId())
                .orElseThrow(() -> new NoSuchElementException("Order not found"));

        OrderItem orderItem = OrderItem.builder()
                .order(order)
                .product(product)
                .quantity(orderItemDto.getQuantity())
                .price(orderItemDto.getPrice())
                .build();

        product.getOrderItems().add(orderItem);

        return orderItem;
    }

    public OrderDto toOrderDto(Order order) {
        return OrderDto.builder()
                .userId(order.getUser().getId())
                .status(order.getStatus())
                .orderNumber(order.getOrderNumber())
                .orderDate(order.getOrderDate())
                .paymentMethod(order.getPaymentMethod())
                .shippingAddressId(order.getShippingAddress().getId())
                .orderTotal(order.getTotalAmount())
                .orderItems(order.getOrderItems()
                        .stream()
                        .filter(orderItem -> orderItem.getProduct() != null)
                        .map(this::toOrderItemDto)
                        .collect(Collectors.toList()))
                .build();
    }

}
