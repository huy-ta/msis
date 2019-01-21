package com.msis.app.domain.service;

import com.msis.app.domain.entity.Role;
import com.msis.app.domain.entity.RoleName;
import com.msis.app.domain.entity.User;
import com.msis.app.domain.exception.DomainException;
import com.msis.app.domain.repository.RoleRepository;
import com.msis.app.domain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    BCryptPasswordEncoder passwordEncoder;

    /**
     * Creates a new user from the provided parameters.
     *
     * @param username a unique username
     * @param password a raw password string
     * @param name     the user's full name
     * @param role     the role of the user as a string, will be converted to <i>RoleName</i> enum
     * @return the successfully created user
     */
    public User createUser(String username, String password, String name, String role) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setName(name);

        Role foundRole = roleRepository.findByName(RoleName.valueOf(role))
                .orElseThrow(() -> new DomainException("Role not found."));

        user.setRoles(Collections.singleton(foundRole));

        return userRepository.save(user);
    }

    public void changeUserRole(User user, String role) {
        Role foundRole = roleRepository.findByName(RoleName.valueOf(role))
                .orElseThrow(() -> new DomainException("Role not found."));

        user.setRoles(Collections.singleton(foundRole));

        userRepository.save(user);
    }

    public void saveNewPasswordForUser(String newPassword, Long userId) {
        User user = userRepository.findById(userId).get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }


    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Finds a user on the database by username.
     *
     * @param username the username of a user
     * @return the user found or an empty <i>Optional</i>
     */
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * Checks if a user exists on the database or not by username.
     *
     * @param username the username of the user
     * @return true if the user exists or false otherwise
     */
    public boolean doesUserExist(String username) {
        return userRepository.existsByUsername(username);
    }

    /**
     * Checks if two strings of password match.
     *
     * @param currentPassword the raw password from a request
     * @param encodedPassword the BCrypt-encoded password from a user on the database
     * @return true if there's a match or false otherwise
     */
    public boolean doesPasswordMatch(String currentPassword, String encodedPassword) {
        return passwordEncoder.matches(currentPassword, encodedPassword);
    }

}