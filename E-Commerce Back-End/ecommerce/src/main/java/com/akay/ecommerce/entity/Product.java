package com.akay.ecommerce.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;
import java.util.Objects;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is mandatory")
    private String title;

    @NotBlank(message = "Description is mandatory")
    @Column(length = 1000)
    private String description;

    @NotNull(message = "Price is mandatory")
    @Min(value = 0, message = "Price should not be less than 0")
    private Double price;

    @NotNull(message = "Stock is mandatory")
    @Min(value = 0, message = "Quantity should not be less than 0")
    private Integer stock;

    @NotBlank(message = "SKU is mandatory")
    @Column(unique = true)
    private String sku;

    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @ToString.Exclude  // Prevents infinite loop
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id")
    @ToString.Exclude  // Prevents infinite loop
    private Vendor vendor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "favorite_id")
    @ToString.Exclude  // Prevents infinite loop
    private Favorite favorite;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private List<CartItem> cartItems;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    @ToString.Exclude  // Prevents infinite loop
    private List<OrderItem> orderItems;

    @Override
    public int hashCode() {
        return Objects.hash(id);  // Use a unique identifier instead of the whole object
    }
}
