package com.akay.ecommerce.email;

import lombok.Getter;

@Getter
public enum EmailTemplateName {

    ACTIVATE_ACCOUNT("activate_account"),
    SEND_ORDER_INFO("send_order_info"),
    RESET_PASSWORD_MAIL("reset_password_mail");


    private final String name;
    EmailTemplateName(String name) {
        this.name = name;
    }
}