package com.example.flower_shop.controller;

import java.util.Map;

import com.example.flower_shop.model.User;
import com.example.flower_shop.model.RefreshToken;
import com.example.flower_shop.service.UserService;
import com.example.flower_shop.service.JwtService;
<<<<<<< HEAD
import com.example.flower_shop.service.RefreshTokenService;
=======

>>>>>>> ef5f694 (duke e rregullu jwt)
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/auth")
public class AuthController {

<<<<<<< HEAD
    private final UserService userService;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserService userService, 
                          JwtService jwtService, 
                          RefreshTokenService refreshTokenService, 
                          PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
=======
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository,
                          JwtService jwtService,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
>>>>>>> ef5f694 (duke e rregullu jwt)
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
<<<<<<< HEAD
    public Map<String, String> register(@RequestBody User user) {
        userService.registerNewUser(user);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully");
        return response;
=======
    public String register(@RequestBody User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return "User registered successfully";
>>>>>>> ef5f694 (duke e rregullu jwt)
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody User user) {
<<<<<<< HEAD
        User dbUser = userService.getUserByEmail(user.getEmail());

        if (!passwordEncoder.matches(user.getPassword(), dbUser.getPassword())) {
            throw new RuntimeException("Kredencialet e gabuara!");
        }

        String accessToken = jwtService.generateToken(dbUser.getEmail());
        
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(dbUser.getEmail());

        Map<String, String> response = new HashMap<>();
        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken.getToken());
        response.put("email", dbUser.getEmail());
        
        return response;
    }

    @PostMapping("/refresh")
    public Map<String, String> refresh(@RequestBody Map<String, String> request) {
        String requestToken = request.get("refreshToken");

        return refreshTokenService.findByToken(requestToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String token = jwtService.generateToken(user.getEmail());
                    Map<String, String> response = new HashMap<>();
                    response.put("accessToken", token);
                    response.put("refreshToken", requestToken);
                    return response;
                }).orElseThrow(() -> new RuntimeException("Refresh token nuk është në bazë të dhënave!"));
=======

        User dbUser = userRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(user.getPassword(), dbUser.getPassword())) {
            throw new RuntimeException("Wrong password");
        }

        String token = jwtService.generateToken(dbUser.getEmail());

        return Map.of("token", token);
>>>>>>> ef5f694 (duke e rregullu jwt)
    }
}