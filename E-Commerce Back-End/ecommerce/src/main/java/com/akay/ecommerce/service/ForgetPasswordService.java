package com.akay.ecommerce.service;

import com.akay.ecommerce.dto.ResetPasswordDto;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ForgetPasswordService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final ForgetPasswordRepository forgetPasswordRepository;

    public String verifyEmail(String email) throws MessagingException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));

        ForgetPassword existingToken = forgetPasswordRepository.findByUser(user);

        // If a token exists and is expired, delete it to not give duplicate error
        if (existingToken != null && existingToken.getExpiryDate().before(Date.from(Instant.now()))) {
            forgetPasswordRepository.delete(existingToken);
        } else if (existingToken != null) {
            throw new RuntimeException("A valid token already exists for this user.");
        }

        String token = UUID.randomUUID().toString();

        ForgetPassword fp = ForgetPassword.builder()
                .token(token)
                .expiryDate(new Date(System.currentTimeMillis() + 70 * 1000))
                .user(user)
                .build();

        String resetLink = "http://localhost:3000/reset-password?token=" + token;

        emailService.sendResetPasswordEmail(
                email,
                EmailTemplateName.RESET_PASSWORD_MAIL,
                resetLink,
                "Token for Forget Password request"
        );

        forgetPasswordRepository.save(fp);

        return "Email sent for verification succesfully!";
    }

    public User resetPassword(String token, ResetPasswordDto resetPasswordDto) {
        ForgetPassword forgetPassword = forgetPasswordRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token!"));

        User user = forgetPassword.getUser();

        if (!resetPasswordDto.getNewPassword().equals(resetPasswordDto.getNewPasswordAgain())) {
            throw new PasswordExceptions("Passwords aren't same!");
        }

        if (passwordEncoder.matches(resetPasswordDto.getNewPassword(), user.getPassword())) {
            throw new PasswordExceptions("Your new password can't be the same as the old one!");
        }

        user.setPassword(passwordEncoder.encode(resetPasswordDto.getNewPassword()));

        User savedUser = userRepository.save(user);

        // Detach the ForgetPassword entity to avoid circular reference
        forgetPasswordRepository.delete(forgetPassword);

        return savedUser;
    }

}
