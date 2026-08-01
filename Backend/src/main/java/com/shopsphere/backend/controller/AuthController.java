package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.auth.LoginRequest;
import com.shopsphere.backend.dto.auth.LoginResponse;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User register(@Valid @RequestBody User user) {
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return userService.loginUser(request);
    }
}