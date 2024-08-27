package com.akay.ecommerce.controller;

import com.akay.ecommerce.dto.ResetPasswordDto;
import com.akay.ecommerce.entity.User;
import com.akay.ecommerce.service.ForgetPasswordService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/forgetPassword")
public class ForgetPasswordController {

    private final ForgetPasswordService forgetPasswordService;


    @PostMapping("/verifyEmail")
    public ResponseEntity<String> verifyEmail(@RequestParam String email) {
        try {
            String message = forgetPasswordService.verifyEmail(email);
            return ResponseEntity.ok(message);
        } catch (RuntimeException | MessagingException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }



    @PutMapping("/resetPassword")
    public ResponseEntity<?> updatePassword(@RequestParam("token") String token, @Valid @RequestBody ResetPasswordDto resetPasswordDto) {
        try {

            User updatedUser = forgetPasswordService.resetPassword(token, resetPasswordDto);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}
