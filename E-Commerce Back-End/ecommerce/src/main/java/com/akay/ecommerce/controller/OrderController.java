package com.akay.ecommerce.controller;

import com.akay.ecommerce.dto.OrderDto;
import com.akay.ecommerce.entity.Address;
import com.akay.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/addOrder")
    public ResponseEntity<OrderDto> addOrder(@Valid @RequestBody OrderDto orderDto) {

        try {
            return ResponseEntity.ok(orderService.saveOrder(orderDto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/getAllOrders")
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        try {
            return ResponseEntity.ok(orderService.getAllOrders());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/getUserOrders")
    public ResponseEntity<List<OrderDto>> getUserOrders(@RequestParam Integer userId) {
        try {
            return ResponseEntity.ok(orderService.getUserOrders(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/saveAddress")
    public ResponseEntity<Address> saveAddress(@Valid @RequestBody Address address) {
        try {
            return ResponseEntity.ok(orderService.saveAddress(address));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/getAddress")
    public ResponseEntity<Address> getAddress(@RequestParam Long shippingAddressId) {
        try {
            return ResponseEntity.ok(orderService.getAddress(shippingAddressId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

}
