package com.msis.app.application.payload.request;

import java.util.Set;

import javax.validation.constraints.NotNull;

import lombok.Value;

/**
 * The data of the module registration request is converted 
 * from a JSON message in the BODY portion of the HTTP Request
 */
@Value
public class CreateStudentModuleRegistrationRequest {
	
	 @NotNull
	 private Set<String> moduleIds;
	 
	 @NotNull
	 private String termId;

}