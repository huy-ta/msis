package com.msis.app.domain.entity;

import lombok.Data;
import org.hibernate.annotations.NaturalId;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Data
@Entity
@Table(name = "roles")
public class Role {
    /**
     * The auto-generated id by Hibernate. This id also serves as the primary key.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    /**
     * The name of the role, must be unique and shorter than 60 characters.
     * This is a required property.
     */
    @NotNull
    @Enumerated(EnumType.STRING)
    @NaturalId
    @Column(name = "name", length = 60)
    private RoleName name;

    /**
     * Default constructor
     */
    public Role() {

    }
}
