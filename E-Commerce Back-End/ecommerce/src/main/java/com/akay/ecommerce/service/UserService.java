package com.akay.ecommerce.service;

import com.akay.ecommerce.dto.ModelConvert;
import com.akay.ecommerce.dto.ResetPasswordDto;
import com.akay.ecommerce.dto.UserInfoRequest;
import com.akay.ecommerce.dto.UserInfoResponse;
import com.akay.ecommerce.email.EmailService;
import com.akay.ecommerce.email.EmailTemplateName;
import com.akay.ecommerce.entity.ForgetPassword;
import com.akay.ecommerce.entity.User;
import com.akay.ecommerce.exception.PasswordExceptions;
import com.akay.ecommerce.exception.UserNotFoundException;
import com.akay.ecommerce.repository.ForgetPasswordRepository;
import com.akay.ecommerce.repository.UserRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelConvert modelConvert;

    public User updateUser(String email, UserInfoRequest userInfoRequest) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with this email: "+email));

        user.setFirstName(userInfoRequest.getFirstname());
        user.setLastName(userInfoRequest.getLastname());
        user.setPassword(passwordEncoder.encode(userInfoRequest.getPassword()));
        user.setPhone(userInfoRequest.getPhone());
        user.setDateOfBirth(userInfoRequest.getDateOfBirth());
        return userRepository.save(user);
    }

    public User updatePassword(String email,String currentPassword ,String newPassword) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));

        if(currentPassword.isEmpty() || newPassword.isEmpty()) {
            throw new PasswordExceptions("Please enter your current and new passwords!");
        }

        if(!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new PasswordExceptions("Your Current Passwords don't match!");
        }

        if(passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new PasswordExceptions("Passwords are same!");
        }

        if(newPassword.length() < 8) {
            throw new PasswordExceptions("Password must be at least 8 characters long");
        }

        user.setPassword(passwordEncoder.encode(newPassword));

        User savedUser = userRepository.save(user);
        return savedUser;
    }

    public UserInfoResponse getUser(String email) {
         User user =  userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));

        return modelConvert.toUserInfoResponse(user);
    }
}


