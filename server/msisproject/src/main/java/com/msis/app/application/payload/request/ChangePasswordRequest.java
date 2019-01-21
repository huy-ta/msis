package com.msis.app.application.payload.request;
import lombok.Value;
import javax.validation.constraints.NotBlank;

@Value
public class ChangePasswordRequest {
    @NotBlank
    private String password;

    @NotBlank
    private String newPassword;
}
