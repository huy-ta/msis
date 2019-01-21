package com.msis.app.application.payload.response;
import org.json.simple.JSONObject;

import lombok.Data;

@Data
public class ApiErrorResponse extends ApiResponse {

    private Object errors;

    public ApiErrorResponse(final Boolean success, final String message, final Object errors) {
        super(success, message);
        this.errors = errors;
    }
}
