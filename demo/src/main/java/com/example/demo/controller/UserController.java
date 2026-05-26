package com.example.demo.controller;

import com.example.demo.dto.UserResponse;
import com.example.demo.model.User;
import com.example.demo.service.UserService;
import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.ChangePasswordRequest;
import com.example.demo.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    public UserController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @GetMapping("/me")
    public UserResponse getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        User user = userService.findByEmail(email);
        return userService.toResponse(user);
    }

    @PutMapping("/me/password")
    public AuthResponse changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {

        String email = authentication.getName();
        User user = userService.findByEmail(email);
        userService.changePassword(user, request);

        String freshToken = jwtService.generateToken(email);
        return new AuthResponse(freshToken);
    }

}