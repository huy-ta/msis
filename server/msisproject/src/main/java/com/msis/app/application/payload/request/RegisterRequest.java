package com.msis.app.application.payload.request;

import lombok.Value;

import javax.validation.constraints.*;

@Value
public class RegisterRequest {
    @NotBlank
    private String userId;

    @NotBlank
    private String name;

    @NotBlank
    private String username;

    @NotBlank
    private String password;

    @NotBlank
    private String role;
}
