package com.msis.app.domain.entity;

import lombok.Data;
import org.hibernate.annotations.NaturalId;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "users")
public class User {
    /**
     * The auto-generated id by Hibernate. This id also serves as the primary key.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;

    /**
     * The unique username of the user. Must be between 6 and 15 characters.
     */
    @NaturalId
    @Column(name = "username", unique = true)
    private String username;

    /**
     * The encoded password of the user. This is a required property.
     */
    @NotBlank
    @Column(name = "password")
    private String password;

    /**
     * The name of the user. Must be between 3 and 40 characters.
     * This is a required property.
     */
    @NotBlank
    @Size(min = 3, max = 40, message = "Name must be between {min} and {max} characters.")
    @Column(name = "name")
    private String name;

    /**
     * The roles of the user.
     */
    @Column(name = "roles")
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    /**
     * Default constructor
     */
    public User() {

    }
}
