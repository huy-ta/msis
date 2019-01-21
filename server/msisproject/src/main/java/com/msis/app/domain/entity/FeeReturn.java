package com.msis.app.domain.entity;
import lombok.Data;
/** documentation 
 * 
 * FeeReturn type to return
 * 
 * @author khaipv
 * @since 2018-11-17
 * @version 1.0
 */

@Data
public class FeeReturn {
	/**
	 * credits of fee
	 * 
	 */
	private int credits;
	
 	private Double tuition;
 	/**
 	 * tuition of fee
 	 */
 	private Double amount;
 	/**price of one credits
 	 * 
 	 */
    public FeeReturn()
    {
    	
    }
	
}
