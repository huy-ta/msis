package com.msis.app.application.payload.request;

import lombok.Value;

import javax.validation.constraints.*;

/**
 * The data of the user account creation request is converted 
 * from a JSON message in the BODY portion of the HTTP Request
 */
@Value
public class CreateUserRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String username;

    @NotBlank
    private String password;

    @NotBlank
    private String role;
}