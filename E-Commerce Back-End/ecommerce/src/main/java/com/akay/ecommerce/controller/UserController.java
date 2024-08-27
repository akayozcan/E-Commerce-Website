package com.akay.ecommerce.controller;

import com.akay.ecommerce.dto.UserInfoRequest;
import com.akay.ecommerce.dto.UserInfoResponse;
import com.akay.ecommerce.entity.User;
import com.akay.ecommerce.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/update")
    public ResponseEntity<?> editUser(Principal principal, @Valid @RequestBody UserInfoRequest userInfoRequest) {
        try {
            User updatedUser = userService.updateUser(principal.getName(), userInfoRequest);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("User not found");
        }
    }

    @PutMapping("/updatePassword")
    public ResponseEntity<?> updatePassword(Principal principal,@RequestParam String currentPassword,@RequestParam String newPassword) {
        try {
            User updatedUser = userService.updatePassword(principal.getName(), currentPassword, newPassword);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @GetMapping("/getUser")
    public ResponseEntity<?> getUser(Principal principal) {
        try {
            UserInfoResponse userInfoResponse = userService.getUser(principal.getName());
            return ResponseEntity.ok(userInfoResponse);
        } catch (RuntimeException e) {
            System.err.println("Error: " + e.getMessage());
            return ResponseEntity.status(404).body("User not found");
        }
    }

}

