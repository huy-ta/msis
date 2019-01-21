package com.msis.app.application.payload.response;

import lombok.Data;

@Data
public class ApiDetailResponse extends ApiResponse {

    private Object details;

    public ApiDetailResponse(final Boolean success, final String message, final Object details) {
        super(success, message);
        this.details = details;
    }

}
