package com.example.flower_shop.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "supplyorders")
@Data
public class SupplyOrders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "furnitori_id")
    private Supplier furnitori;

    @Column(name = "data_porosis")
    private LocalDate dataPorosis;

    @Column(name = "shuma_totale")
    private Double shumaTotale;

    private String statusi;
}