package com.akay.ecommerce.service;

import com.akay.ecommerce.dto.ModelConvert;
import com.akay.ecommerce.dto.OrderDto;
import com.akay.ecommerce.email.EmailService;
import com.akay.ecommerce.email.EmailTemplateName;
import com.akay.ecommerce.entity.*;
import com.akay.ecommerce.exception.ProductNotFoundException;
import com.akay.ecommerce.exception.UserNotFoundException;
import com.akay.ecommerce.repository.AddressRepository;
import com.akay.ecommerce.repository.OrderRepository;
import com.akay.ecommerce.repository.ProductRepository;
import com.akay.ecommerce.repository.UserRepository;
import com.akay.ecommerce.utility.OrderStatus;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;
import java.security.SecureRandom;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final ModelConvert modelConvert;
    private final EmailService emailService;
    private final ProductRepository productRepository;

    public OrderDto saveOrder(OrderDto orderDto) {
        try {
            User user = userRepository.findById(Math.toIntExact(orderDto.getUserId()))
                    .orElseThrow(() -> new UserNotFoundException("User not found with this id:" + orderDto.getUserId()));

            Address shippingAddress = addressRepository.findById(orderDto.getShippingAddressId())
                    .orElseThrow(() -> new RuntimeException("Shipping address not found with this id:" + orderDto.getShippingAddressId()));

            Order order = Order.builder()
                    .user(user)
                    .orderNumber(generateOrderNumber())
                    .status(OrderStatus.PENDING)
                    .paymentMethod(orderDto.getPaymentMethod())
                    .shippingAddress(shippingAddress)
                    .orderDate(new Date())
                    .totalAmount(orderDto.getOrderTotal())
                    .orderItems(new ArrayList<>())
                    .build();

            Order savedOrder = orderRepository.save(order);

            Long orderID = savedOrder.getId();
            orderDto.getOrderItems().forEach(orderItem -> orderItem.setOrderId(orderID));

            List<OrderItem> orderItems = orderDto.getOrderItems()
                    .stream()
                    .map(orderItemDto -> {
                        OrderItem orderItem = new OrderItem();

                        Product product = productRepository.findById(orderItemDto.getProductId())
                                .orElseThrow(() -> new ProductNotFoundException("Product not found with this id:" + orderItemDto.getProductId()));

                        orderItem.setProduct(product);
                        orderItem.setQuantity(orderItemDto.getQuantity());
                        orderItem.setPrice(orderItemDto.getPrice());
                        orderItem.setOrder(savedOrder);

                        product.setStock(product.getStock() - orderItemDto.getQuantity());
                        productRepository.save(product);

                        return orderItem;
                    })
                    .collect(Collectors.toList());

            savedOrder.setOrderItems(orderItems);

            Order savedOrderAfterSetOrderItems = orderRepository.save(savedOrder);

            try {
                sendOrderInfoEmail(user, savedOrderAfterSetOrderItems);
            } catch (MessagingException e) {
                e.printStackTrace();
            }

            return modelConvert.toOrderDto(savedOrderAfterSetOrderItems);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("An error occurred while saving the order", e);
        }
    }


    public List<OrderDto> getAllOrders() {

        List<OrderDto> orderDtos = orderRepository.findAll()
                .stream()
                .map(modelConvert::toOrderDto)
                .collect(Collectors.toList());

        return orderDtos;
    }

    public List<OrderDto> getUserOrders(Integer userId) {
        List<OrderDto> orderDtos = orderRepository.findAllByUserId(userId)
                .stream()
                .map(modelConvert::toOrderDto)
                .collect(Collectors.toList());

        return orderDtos;
    }

    private void sendOrderInfoEmail(User user,Order order) throws MessagingException {

        List<OrderItem> orderItems = order.getOrderItems();

        emailService.sendOrderInfoEmail(
                user.getEmail(),
                user.fullName(),
                order.getOrderNumber(),
                "Order Information",
                EmailTemplateName.ACTIVATE_ACCOUNT,
                orderItems,
                order.getTotalAmount()
        );
    }



    private String generateOrderNumber() {
        String characters = "0123456789";
        StringBuilder codeBuilder = new StringBuilder();

        SecureRandom secureRandom = new SecureRandom();

        for (int i = 0; i < 8; i++) {
            int randomIndex = secureRandom.nextInt(characters.length());
            codeBuilder.append(characters.charAt(randomIndex));
        }

        return codeBuilder.toString();
    }

    public Address saveAddress(Address address) {
        return addressRepository.save(address);
    }

    public Address getAddress(Long id) {
        return addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found with this id:"+id));
    }
}
