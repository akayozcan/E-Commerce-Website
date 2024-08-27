package com.akay.ecommerce.dto;

import com.akay.ecommerce.entity.OrderItem;
import com.akay.ecommerce.utility.OrderStatus;
import com.akay.ecommerce.utility.PaymentMethod;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.aop.interceptor.AbstractTraceInterceptor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class OrderDto {
    private String orderNumber;
    @NotEmpty(message = "Payment method is required")
    private String paymentMethod;
    private OrderStatus status;
    private Date orderDate;
    private Double orderTotal;
    private Long shippingAddressId;
    private Integer userId;
    private List<OrderItemDto> orderItems;
}
