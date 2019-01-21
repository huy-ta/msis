package com.msis.app.application.payload.request;

import javax.validation.constraints.NotBlank;

import lombok.Data;

/**
 * The data of the term creation request is converted 
 * from a JSON message in the BODY portion of the HTTP Request
 */
@Data
public class CreateTermRequest {

	@NotBlank
	String termId;
	
	@NotBlank
	String status;
}