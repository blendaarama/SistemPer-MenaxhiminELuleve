package com.example.flower_shop.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "suppliers")
@Data
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String emertimi;
    
    private String kontakti;

    @Column(unique = true, nullable = false)
    private String email;

    private String telefoni;
    private String adresa;
}