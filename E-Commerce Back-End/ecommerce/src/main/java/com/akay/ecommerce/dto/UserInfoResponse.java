package com.akay.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class UserInfoResponse {

    private String firstname;
    private String lastname;
    private String email;
    private String password;
    private String phone;
    private LocalDate dateOfBirth;
}
