package com.akay.ecommerce.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResetPasswordDto {

    @NotNull(message = "Please enter new password")
    @Size(min = 8, message = "Password should be 8 characters long minimum")
    private String newPassword;

    @NotNull(message = "Please enter new password again")
    @Size(min = 8, message = "Password should be 8 characters long minimum")
    private String newPasswordAgain;
}
