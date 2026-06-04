package com.example.flower_shop.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "UserTokens")
@Data
public class UserToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "login_provider")
    private String loginProvider;

    @Column(name = "token_name")
    private String tokenName;

    @Column(name = "token_value", length = 2000)
    private String tokenValue;
}