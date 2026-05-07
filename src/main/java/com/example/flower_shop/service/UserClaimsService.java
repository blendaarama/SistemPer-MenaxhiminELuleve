package com.example.flower_shop.service;

import com.example.flower_shop.model.UserClaims;
import com.example.flower_shop.repository.UserClaimsRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserClaimsService {

    private final UserClaimsRepository userClaimsRepository;

    public UserClaimsService(UserClaimsRepository userClaimsRepository) {
        this.userClaimsRepository = userClaimsRepository;
    }

    public List<UserClaims> getClaimsByUserId(Integer userId) {
        return userClaimsRepository.findByUserId(userId);
    }

    public UserClaims addUserClaim(UserClaims claim) {
        return userClaimsRepository.save(claim);
    }

    public void deleteClaim(Integer claimId) {
        userClaimsRepository.deleteById(claimId);
    }
}