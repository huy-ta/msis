package com.msis.app.application.payload.request;

import javax.validation.constraints.NotBlank;

public class SearchFeeRequest {

	@NotBlank
	private Double amount;
	
	@NotBlank
	private Double numberofcredits;	
	
	@NotBlank 
     private Double tuitionfee;
}
