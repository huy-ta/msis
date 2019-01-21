package com.msis.app.application.payload.request;

import lombok.Value;

import javax.validation.constraints.NotBlank;

@Value
public class LoginRequest {
    @NotBlank
    private String username;

    @NotBlank
    private String password;
}
