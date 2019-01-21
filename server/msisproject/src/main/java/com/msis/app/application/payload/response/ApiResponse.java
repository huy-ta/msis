package com.msis.app.application.payload.response;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class ApiResponse {
    private Boolean success;
    private String message;

    public ApiResponse(final Boolean success, final String message) {
        this.success = success;
        this.message = message;
    }
}
