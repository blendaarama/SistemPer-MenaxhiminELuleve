package com.example.flower_shop.controller;

import com.example.flower_shop.dto.*;
import com.example.flower_shop.model.*;
import com.example.flower_shop.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor 
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        User dbUser = userService.getUserByEmail(request.getEmail());

        if (dbUser == null || !passwordEncoder.matches(request.getPassword(), dbUser.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Email ose fjalëkalim i pasaktë"));
        }

        String accessToken = jwtService.generateToken(dbUser.getEmail());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(dbUser.getEmail());

        return ResponseEntity.ok(new LoginResponse(
            accessToken, 
            refreshToken.getToken(), 
            "Login i suksesshëm", 
            dbUser.getEmail()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        User user = new User();
        user.setEmri(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setStatusi("ACTIVE");

        userService.registerNewUser(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> request) {
        return refreshTokenService.findByToken(request.get("refreshToken"))
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> ResponseEntity.ok(Map.of(
                        "accessToken", jwtService.generateToken(user.getEmail()),
                        "refreshToken", request.get("refreshToken")
                )))
                .orElse(ResponseEntity.status(403).build());
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email != null) {
            refreshTokenService.deleteByEmail(email);
        }
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}