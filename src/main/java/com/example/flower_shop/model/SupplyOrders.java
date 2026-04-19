package com.example.flower_shop.model;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="supplyorders")
public class SupplyOrders {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name="furnitori_id")
    private Supplier furnitori;

    @Column(name="data_porosis")
    private Date dataPorosis;

    @Column(name="shuma_totale")
    private Double shumaTotale;

    private String statusi;

    public Integer getId(){
        return id;
    } 
    public Supplier getFurnitori(){
        return furnitori;
    }
    public void setFurnitori(Supplier furnitori){
        this.furnitori=furnitori;
    }
    public Date getDataPorosis(){
        return dataPorosis;
    }
    public void setDataPorosis(Date dataPorosis){
        this.dataPorosis=dataPorosis;
    }
    public Double getShumaTotale(){
        return shumaTotale;
    }
    public void setShumaTotale(Double shumaTotale){
        this.shumaTotale=shumaTotale;
    }
    public String getStatusi(){
        return statusi;
    }
    public void setStatusi(String statusi){
        this.statusi=statusi;
    }
    
}
