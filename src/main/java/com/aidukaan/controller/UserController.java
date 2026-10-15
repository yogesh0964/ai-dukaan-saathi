package com.aidukaan.controller;

import com.aidukaan.model.User;
import com.aidukaan.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {

        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody User user) {

        String token = userService.loginUser(
                user.getEmail(),
                user.getPassword()
        );

        Map<String, String> response = new HashMap<>();

        response.put("token", token);
        response.put("message", "Login successful");

        return response;
    }
}