package com.akay.ecommerce.dto;

import com.akay.ecommerce.entity.Category;
import com.akay.ecommerce.entity.Product;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class CategoryDto {
    private Long id;

    private String title;

    private String imageURL;
}
