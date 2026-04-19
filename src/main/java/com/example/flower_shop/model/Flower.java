package com.example.flower_shop.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "flowers")
@Data
public class Flower {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String emertimi;

    private String lloji;
    private String ngjyra;

    @Column(nullable = false)
    private Double cmimi;
    
    @Column(name = "sasia_stokut", nullable = false)
    private Integer sasiaStokut;

    private String sezoni;

    @Column(name = "jetegjatesia_ditesh")
    private Integer jetegjatesiaDitesh;

    private String foto;
}