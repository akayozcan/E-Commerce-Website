package com.akay.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ProductDto {
    private Long id;
    private String title;
    private String description;
    private Double price;
    private Integer stock;
    private String sku;
    private String imageUrl;
    private Long categoryId;
    private Long vendorId;
}
