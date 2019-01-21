package com.msis.app.application.payload.request;

import lombok.Value;

import javax.validation.constraints.NotNull;

@Value
public class CreateModuleGradeRequest {
    @NotNull
    private Double midTermGrade;

    private Double finalGrade;
}
