package com.msis.app.application.controller;

import com.msis.app.application.payload.request.LoginRequest;
import com.msis.app.application.payload.request.RegisterRequest;
import com.msis.app.application.payload.response.ApiDetailResponse;
import com.msis.app.application.payload.response.ApiErrorResponse;
import com.msis.app.application.payload.response.ApiResponse;
import com.msis.app.domain.entity.User;
import com.msis.app.domain.repository.RoleRepository;
import com.msis.app.domain.repository.UserRepository;
import com.msis.app.domain.service.UserService;
import com.msis.app.spring.security.JwtTokenProvider;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    UserService userService;

    @Autowired
    JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@Valid @RequestBody LoginRequest loginRequest) {
        final String username = loginRequest.getUsername();
        final String password = loginRequest.getPassword();

        final Optional<User> foundUser = userService.getUserByUsername(username);

        if (!foundUser.isPresent()) {
            JSONObject errors = new JSONObject();
            errors.put("username", "Username not found.");
            return new ResponseEntity<>(new ApiErrorResponse(false, "Authentication failed.", errors),
                    HttpStatus.NOT_FOUND);
        }

        if (!userService.doesPasswordMatch(password, foundUser.get().getPassword())) {
            JSONObject errors = new JSONObject();
            errors.put("password", "Password incorrect.");
            return new ResponseEntity<>(new ApiErrorResponse(false, "Authentication failed.", errors),
                    HttpStatus.BAD_REQUEST);
        }

        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwtAuthToken = tokenProvider.generateToken(authentication);

        JSONObject details = new JSONObject();
        details.put("tokenType", "Bearer");
        details.put("authToken", jwtAuthToken);

        foundUser.get().getRoles().iterator().next().getName();

        return ResponseEntity.ok(new ApiDetailResponse(true, "Successfully authenticated.", details));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userService.doesUserExist(registerRequest.getUsername())) {
            JSONObject errors = new JSONObject();
            errors.put("username", "Username is already taken.");
            return new ResponseEntity<>(new ApiErrorResponse(false, "Registration failed.", errors),
                    HttpStatus.BAD_REQUEST);
        }

        User result = userService.createUser(
                registerRequest.getUsername(),
                registerRequest.getPassword(),
                registerRequest.getName(),
                registerRequest.getRole()
        );

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/api/users/{username}")
                .buildAndExpand(result.getUsername()).toUri();

        return ResponseEntity.created(location).body(new ApiResponse(true, "User registered successfully."));
    }
}
