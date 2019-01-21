package com.msis.app.domain.dto;

import lombok.Data;

import javax.persistence.Id;
import java.time.LocalDateTime;

@Data
public class ModuleBasicInfoDTO {
    @Id
    private Long id;

    private String moduleId;

    private String name;

    private Integer numOfCredits;

    private Double numOfFeeCredits;

    private Double weight;

    private LocalDateTime createdDate;

    public ModuleBasicInfoDTO() {

    }

    public ModuleBasicInfoDTO(Long id, String moduleId, String name, Integer numOfCredits, Double numOfFeeCredits, Double weight, LocalDateTime createdDate) {
        this.id = id;
        this.moduleId = moduleId;
        this.name = name;
        this.numOfCredits = numOfCredits;
        this.numOfFeeCredits = numOfFeeCredits;
        this.weight = weight;
        this.createdDate = createdDate;
    }
}
