package com.example.flower_shop.model;

import java.util.Date;
import java.sql.Time;
import java.time.LocalTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

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

    private Date dataDorezimit;
    private LocalTime oraDorezimit;
    private String statusi;
    private String firmaPranuesit;


    public Porosi getPorosia(){
        return porosia;
    }
    public void setPorosia(Porosi porosia){
        this.porosia=porosia;
    }
    public Supplier getKorrieri(){
        return korrieri;
    }
    public void setKorrieri(Supplier korrieri){
        this.korrieri=korrieri;
    }
    public Date getDataDorezimit(){
        return dataDorezimit;
    }
    public void setDataDorezimit(Date dataDorezimit){
        this.dataDorezimit=dataDorezimit;
    }
    public LocalTime getOraDorezimit(){
        return oraDorezimit;
    }
    public void setOraDorezimit(LocalTime oraDorezimit){
        this.oraDorezimit=oraDorezimit;
    }
    public String getStatusi(){
        return statusi;
    }
    public void setStatusi(String statusi){
        this.statusi=statusi;
    }
    public String getFirmaPranuesit(){
        return firmaPranuesit;
    }
    public void setFirmaPranuesit(String firmaPranuesit){
        this.firmaPranuesit=firmaPranuesit;
    }

    
}
