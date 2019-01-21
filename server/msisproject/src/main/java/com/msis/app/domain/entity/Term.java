package com.msis.app.domain.entity;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import org.hibernate.annotations.NaturalId;

import lombok.Data;

@Data
@Entity
@Table(name = "terms")
public class Term {

	/**
	 * The auto-generated id by Hibernate. This id also serves as the primary key.
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
	private Long id;
	
	/**
	 * The id of term.
	 * This is a required property, and must include from 5 to 7 characters.
	 */
	@NotBlank
	@Size(min = 5, max = 7, message = "Term ID must be between {min} and {max} characters.")
	@Column(name = "term_id")
	private String termId;

	/**
	 * The status of term.
	 */
	@Enumerated(EnumType.STRING)
    @Column(name = "status", length = 60)
    private TermStatus status;
	
	public Term() {
		
	}
	
}
