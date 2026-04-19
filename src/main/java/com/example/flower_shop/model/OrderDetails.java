package com.example.flower_shop.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "orderdetails")
public class OrderDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "porosia_id")
    private Porosi porosia;

    @ManyToOne
    @JoinColumn(name = "buqeta_id")
    private Bouquet buqeta;

    @ManyToOne
    @JoinColumn(name = "lulja_id")
    private Flower flower;

    private Integer sasia;

    private Double cmimi_njesi;

    private Double shuma;

    // ID
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // POROSIA
    public Porosi getPorosi() {
        return porosia;
    }

    public void setPorosi(Porosi porosia) {
        this.porosia = porosia;
    }

    // BUQETA
    public Bouquet getBuqeta() {
        return buqeta;
    }

    public void setBuqeta(Bouquet buqeta) {
        this.buqeta = buqeta;
    }

    // FLOWER
    public Flower getFlower() {
        return flower;
    }

    public void setFlower(Flower flower) {
        this.flower = flower;
    }

    // SASIA
    public Integer getSasia() {
        return sasia;
    }

    public void setSasia(Integer sasia) {
        this.sasia = sasia;
    }

    // CMIMI NJESI
    public Double getCmimiNjesi() {
        return cmimi_njesi;
    }

    public void setCmimiNjesi(Double cmimi_njesi) {
        this.cmimi_njesi = cmimi_njesi;
    }

    // SHUMA
    public Double getShuma() {
        return shuma;
    }

    public void setShuma(Double shuma) {
        this.shuma = shuma;
    }
}