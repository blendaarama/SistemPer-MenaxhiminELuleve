package com.example.flower_shop.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "occasions")
@Data
public class Occasion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String emertimi;

    private String pershkrimi;
    
    @Column(name = "data_ngjarjes")
    private LocalDate dataNgjarjes;

    @Column(name = "zbritja_perqindje")
    private Double zbritjaPerqindje;
}
