package com.akay.ecommerce.repository;

import com.akay.ecommerce.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository  extends JpaRepository<OrderItem,Long> {
    List<OrderItem> findByProductId(Long productId);

}
