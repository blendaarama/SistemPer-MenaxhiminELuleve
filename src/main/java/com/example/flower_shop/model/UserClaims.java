package com.example.flower_shop.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "UserClaims")
@Data
public class UserClaims {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String claimType;
    private String claimValue;
}