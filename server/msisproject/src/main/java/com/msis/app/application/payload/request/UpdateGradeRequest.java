package com.msis.app.application.payload.request;

import lombok.Value;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Value
public class UpdateGradeRequest {
    private String midTermGrade;

    private String finalGrade;
}