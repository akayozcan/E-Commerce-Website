package com.akay.ecommerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "favorite")
public class Favorite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "favorite", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Product> products;

    @OneToOne(mappedBy = "favorite")
    private User user;

    // Helper methods for manage the bidirectional relationship because JPA doesn't manage it automatically
    public void addProduct(Product product) {
        products.add(product);
        product.setFavorite(this);
    }

    public void removeProduct(Product product) {
        products.remove(product);
        product.setFavorite(null);
    }
}
