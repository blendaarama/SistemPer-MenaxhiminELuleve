package com.example.flower_shop.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    private String emri;
    private String mbiemri;
    
    @Column(unique = true)
    private String email;
    
    @Column(name = "password_hash", nullable = false)
    private String password;
    
    private String statusi;
    
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "UserRoles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();
}