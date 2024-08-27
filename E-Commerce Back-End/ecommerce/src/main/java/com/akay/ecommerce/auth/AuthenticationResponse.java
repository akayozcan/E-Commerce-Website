package com.akay.ecommerce.auth;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AuthenticationResponse {
    private Integer userId;
    private Long cartId;
    private String token;
    private String userRole;
}