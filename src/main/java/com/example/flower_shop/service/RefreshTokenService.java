package com.example.flower_shop.service;

import com.example.flower_shop.model.RefreshToken;
import com.example.flower_shop.repository.RefreshTokenRepository;
import com.example.flower_shop.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository, UserRepository userRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
    }

    public RefreshToken createRefreshToken(String email) {
        RefreshToken refreshToken = new RefreshToken();
        
        refreshToken.setUser(userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found")));
        
        refreshToken.setExpiryDate(Instant.now().plusMillis(86400000)); 
        refreshToken.setToken(UUID.randomUUID().toString());

        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token ka skaduar. Ju lutem lini perseri.");
        }
        return token;
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }
}