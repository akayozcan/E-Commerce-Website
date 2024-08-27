package com.akay.ecommerce.repository;

import com.akay.ecommerce.entity.ForgetPassword;
import com.akay.ecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ForgetPasswordRepository extends JpaRepository<ForgetPassword, Integer> {
    public ForgetPassword findByUser(User user);
    public Optional<ForgetPassword> findByToken(String token);
}
