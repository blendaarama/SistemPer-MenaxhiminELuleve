package com.example.flower_shop.model;

import java.time.LocalTime;
import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "deliveries")
public class Deliveries {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "porosia_id")
    private Porosi porosia;

    @ManyToOne
    @JoinColumn(name = "korrieri_id")
    private Supplier korrieri;
    

    @Column(name = "data_dorezimit")
    private Date dataDorezimit;
    @Column(name = "ora_dorezimit")
    private LocalTime oraDorezimit;
    private String statusi;
    @Column(name = "firma_pranuesit")
    private String firmaPranuesit;

  
    
}
