package com.msis.app.application.controller;

import com.msis.app.application.payload.request.ChangePasswordRequest;
import com.msis.app.application.payload.request.CreateUserRequest;
import com.msis.app.application.payload.response.ApiDetailResponse;
import com.msis.app.application.payload.response.ApiErrorResponse;
import com.msis.app.application.payload.response.ApiResponse;
import com.msis.app.domain.entity.User;
import com.msis.app.domain.repository.UserRepository;
import com.msis.app.domain.service.UserService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    UserRepository userRepository;

    @GetMapping(value = "", produces = "application/json; charset=utf-8")
    public ResponseEntity<?> getAll() {
        List<User> users = userRepository.findAll();

        JSONObject details = new JSONObject();
        details.put("users", users);

        return ResponseEntity.ok(new ApiDetailResponse(true, "Successfully got all users.", details));
    }

    @PostMapping(value = "", produces = "application/json; charset=utf-8")
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest createUserRequest) {
        if (userRepository.existsByUsername(createUserRequest.getUsername())) {
            JSONObject errors = new JSONObject();
            errors.put("username", "User is already taken.");
            return new ResponseEntity<>(new ApiErrorResponse(false, "Create failed.", errors),
                    HttpStatus.BAD_REQUEST);
        }

        User result = userService.createUser(
                createUserRequest.getUsername(),
                createUserRequest.getPassword(),
                createUserRequest.getName(),
                createUserRequest.getRole()
        );

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/api/users/{username}")
                .buildAndExpand(result.getUsername()).toUri();

        return ResponseEntity.created(location).body(new ApiResponse(true, "User created successfully."));
    }

    @GetMapping(value = "/{username}", produces = "application/json; charset=utf-8")
    public ResponseEntity<?> getOne(@PathVariable("username") String username) {
        Optional<User> user = userRepository.findByUsername(username);

        if (user.isPresent()) {
            JSONObject details = new JSONObject();
            details.put("user", user);

            return ResponseEntity.ok(new ApiDetailResponse(true, "User found.", details));
        }

        JSONObject errors = new JSONObject();
        errors.put("userId", "No user found with current userId.");

        return new ResponseEntity<>(new ApiErrorResponse(false, "User not found.", errors), HttpStatus.NOT_FOUND);
    }


    @DeleteMapping(value = "/{username}", produces = "application/json; charset=utf-8")
    public ResponseEntity<?> deleteUser(@PathVariable("username") String username) {

        Optional<User> user = userRepository.findByUsername(username);
        if (!user.isPresent()) {
            JSONObject errors = new JSONObject();
            errors.put("username", "User not found.");
            return new ResponseEntity<>(new ApiErrorResponse(false, "Validation failed.", errors),
                    HttpStatus.NOT_FOUND);
        }

        userRepository.deleteById(user.get().getId());

        return ResponseEntity.ok(new ApiResponse(true, "Delete user successfully."));
    }

    @PutMapping(value = "/{user-id}/password", produces = "application/json; charset=utf-8")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest changePasswordRequest, @PathVariable("user-id") Long userId) {
        final String password = changePasswordRequest.getPassword();
        final String newPassword = changePasswordRequest.getNewPassword();

        final Optional<User> foundUser = userService.getUserById(userId);

        if (!foundUser.isPresent()) {
            return new ResponseEntity<>(new ApiResponse(false, "User does not exist."), HttpStatus.BAD_REQUEST);
        }

        if (!userService.doesPasswordMatch(password, foundUser.get().getPassword())) {
            JSONObject errors = new JSONObject();
            errors.put("password", "Password incorrect.");
            return new ResponseEntity<>(new ApiErrorResponse(false, "Couldn't change password.", errors), HttpStatus.BAD_REQUEST);
        }

        userService.saveNewPasswordForUser(newPassword, userId);

        return ResponseEntity.ok(new ApiResponse(true, "Changed password successfully."));
    }
}