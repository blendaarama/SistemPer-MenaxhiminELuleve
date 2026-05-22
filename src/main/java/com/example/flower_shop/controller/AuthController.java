package com.example.flower_shop.controller;

import com.example.flower_shop.dto.LoginRequest;
import com.example.flower_shop.dto.LoginResponse;
import com.example.flower_shop.dto.RegisterRequest;
import com.example.flower_shop.model.User;
import com.example.flower_shop.model.RefreshToken;
import com.example.flower_shop.service.UserService;
import com.example.flower_shop.service.JwtService;
import com.example.flower_shop.service.RefreshTokenService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/auth")
public class AuthController {

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
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userService.registerNewUser(user);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        User dbUser = userService.getUserByEmail(loginRequest.getEmail());

        if (dbUser == null || !passwordEncoder.matches(loginRequest.getPassword(), dbUser.getPassword())) {
            return ResponseEntity.status(401).body(new LoginResponse(null, null, "Email ose fjalëkalim i pasaktë", null));
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

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refresh(@RequestBody Map<String, String> request) {
        String requestToken = request.get("refreshToken");

        return refreshTokenService.findByToken(requestToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String token = jwtService.generateToken(user.getEmail());
                    Map<String, String> response = new HashMap<>();
                    response.put("accessToken", token);
                    response.put("refreshToken", requestToken);
                    return ResponseEntity.ok(response);
                }).orElseThrow(() -> new RuntimeException("Refresh token not found"));
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        User user = new User();
        user.setEmri(registerRequest.getName());
        user.setMbiemri("");
        user.setEmail(registerRequest.getEmail());
        
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword())); 
        user.setStatusi("ACTIVE");

        userService.registerNewUser(user);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully");
        return ResponseEntity.ok(response);
    }
}