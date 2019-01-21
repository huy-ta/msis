package com.msis.app.application.payload.request;

	import lombok.Data;
import lombok.Value;
	import javax.validation.constraints.NotBlank;
	import javax.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.Set;

	@Data
	public class UpdateModuleRequest {
        @NotBlank
        private String moduleId;
        
	    @NotBlank
	    private String name;

	    @NotNull
	    private Integer numOfCredits;

	    @NotNull
	    private Double numOfFeeCredits;
        
	    @NotNull
	    private LocalDateTime createdDate;
	    @NotNull
	    private Double weight;

	    private Set<String> coRequisiteModuleIds;

	    private Set<String> readRequisiteModuleIds;

	    private Set<String> passRequisiteModuleIds;
}
