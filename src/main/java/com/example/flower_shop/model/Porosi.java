package com.example.flower_shop.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name="orders")
public class Porosi {
    
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

private Integer klientiId;

private Date dataPorosise;
private Date dataDorezimit;

private String adresaDorezimit;

private String mesazhiKartoline;

private Double shumeTotale;

private String statusi;

public Long getId(){
    return id;
}
public void setId(Long id){
    this.id=id;
}
public Integer getKlientiId(){
    return klientiId;
}
public void setKlientiId(Integer klientiId){
    this.klientiId=klientiId;
}
public Date getDataPorosise(){
    return dataPorosise;
}
public void setDataPorosise(Date dataPorosise){
    this.dataPorosise=dataPorosise;
}
public Date getDataDorezimit(){
    return dataDorezimit;
}
public void setDataDorezimit(Date dataDorezimit){
    this.dataDorezimit=dataDorezimit;
}
public String getAdresaDorezimit(){
    return adresaDorezimit;
}
public void setAdresaDorezimit(String adresaDorezimit){
    this.adresaDorezimit=adresaDorezimit;
}
public String getMesazhiKartoline(){
    return mesazhiKartoline;
}
public void setMesazhiKartoline(String mesazhiKartoline){
    this.mesazhiKartoline=mesazhiKartoline;
}
public Double getShumeTotale(){
    return shumeTotale;
}
public void setShumeTotale(Double shumeTotale){
    this.shumeTotale=shumeTotale;
}
public String getStatusi(){
    return statusi;
}
public void setStatusi(String statusi){
    this.statusi=statusi;
}
}
