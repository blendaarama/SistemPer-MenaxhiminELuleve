package com.example.flower_shop.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "bouquets")
@Data
public class Bouquet {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String emertimi;

    private String pershkrimi;

    @Column(nullable = false)
    private Double cmimi;
    
    private String madhesia;
    private String foto;

    @Column(name = "a_eshte_aktiv")
    private Boolean eshteAktiv;

}
