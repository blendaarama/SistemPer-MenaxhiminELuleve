package com.example.flower_shop.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "customers")
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

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

    private Boolean isVip = false;

    @OneToMany(mappedBy = "klienti")
    @JsonIgnoreProperties({"klienti", "hibernateLazyInitializer", "handler"})
    private List<Porosi> porosite;

    @PrePersist
    protected void onCreate() {
        if (this.dataRegjistrimit == null) {
            this.dataRegjistrimit = LocalDate.now();
        }

        if (this.isVip == null) {
            this.isVip = false;
        }
    }
}