package com.msis.app.application.payload.request;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

@Data
public class CreateModuleRequest {
    @NotBlank
    private String moduleId;

    @NotBlank
    private String name;

    @NotNull
    private Integer numOfCredits;

    @NotNull
    private Double numOfFeeCredits;

    @NotNull
    private Double weight;

    private Set<String> coRequisiteModuleIds = new HashSet<>();

    private Set<String> readRequisiteModuleIds = new HashSet<>();

    private Set<String> passRequisiteModuleIds = new HashSet<>();
}
