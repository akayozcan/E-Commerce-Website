package com.akay.ecommerce.repository;

import com.akay.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product,Long> {
    Optional<Product> findBySku(String sku);
    Optional<Product> findById(Long id);
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);
}
