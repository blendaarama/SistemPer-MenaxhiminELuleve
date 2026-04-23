package com.example.flower_shop.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "klienti_id")
    private Customer klienti;

    @ManyToOne
    @JoinColumn(name = "porosia_id")
    private Porosi porosia;

    private Integer vleresimi; // p.sh 1-5

    private String komenti;

    @Column(name = "data_vleresimit")
    private LocalDate dataVleresimit;

    @PrePersist
    public void onCreate() {
        this.dataVleresimit = LocalDate.now();
    }
}