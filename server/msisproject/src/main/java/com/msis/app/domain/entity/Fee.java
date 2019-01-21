package com.msis.app.domain.entity;
import lombok.Data;
import org.hibernate.annotations.NaturalId;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.Set;
/** documentation
 * 
 * @author khaipv
 * @version 1.0
 * @since 2018-11-17
 */
@Data
@Entity
@Table(name = "fees")
public class Fee {
	/**
     * The auto-generated id by Hibernate. This id also serves as the primary key.
     */
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
	/**
     * The amount of fee
     * This is a required property, and must be a positive double.
     */
	@NotBlank
    @Column(name = "amount")
    private Double amount;
	
	/**
     * Default constructor
     */
    public Fee() {

    }
}
