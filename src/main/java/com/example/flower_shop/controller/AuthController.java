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
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        User dbUser = userService.getUserByEmail(request.getEmail());

        if (dbUser == null || !passwordEncoder.matches(request.getPassword(), dbUser.getPassword())) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Email ose password gabim"));
        }

       String accessToken =
        jwtService.generateToken(
                dbUser.getEmail(),
                dbUser.getRole()
        );
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(dbUser.getEmail());

        return ResponseEntity.ok(new LoginResponse(
                accessToken,
                refreshToken.getToken(),
                "Login success",
                dbUser.getEmail(),
                dbUser.getRole()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
        @Valid @RequestBody RegisterRequest request) {

        User user = new User();
        user.setEmri(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setRole("USER"); // 🔥 DEFAULT ROLE

        userService.registerNewUser(user);

        return ResponseEntity.ok(Map.of("message", "User created"));
    }
}
