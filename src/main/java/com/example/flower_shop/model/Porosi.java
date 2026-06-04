package com.example.flower_shop.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Entity
@Table(name = "orders")
public class Porosi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "klienti_id")
    @JsonIgnoreProperties({"porosite", "orders", "hibernateLazyInitializer", "handler"})
    private Customer klienti;

    @Column(name = "data_porosis")
    private LocalDateTime dataPorosise;

    @Column(name = "data_dorezimit")
    private Date dataDorezimit;

    @Column(name = "adresa_dorezimit")
    private String adresaDorezimit;

    @Column(name = "mesazhi_kartoline")
    private String mesazhiKartoline;

    @Column(name = "shuma_totale")
    private Double shumeTotale;

    private String statusi;
}