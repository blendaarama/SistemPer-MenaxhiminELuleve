package com.example.flower_shop.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "bouquet_flowers")
@Data
public class BouquetFlower {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "bouquet_id")
    private Bouquet bouquet;

    @ManyToOne
    @JoinColumn(name = "flower_id")
    private Flower flower;

    private Integer sasia;
}