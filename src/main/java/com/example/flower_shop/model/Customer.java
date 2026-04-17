package com.example.flower_shop.model;

import java.time.LocalDate;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "customers")
@Data
public class Customer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String emri;

    @Column(nullable = false)
    private String mbiemri;

    @Column(unique = true, nullable = false)
    private String email;

    private String telefoni;
    private String adresa;

    @Column(name = "data_regjistrimit")
    private LocalDate dataRegjistrimit;

    @PrePersist
    protected void onCreate() {
        this.dataRegjistrimit = LocalDate.now();
    }
}
