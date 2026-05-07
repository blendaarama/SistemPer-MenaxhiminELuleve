package com.example.flower_shop.repository;

import com.example.flower_shop.model.UserClaims;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserClaimsRepository extends JpaRepository<UserClaims, Integer> {
    List<UserClaims> findByUserId(Integer userId);
}