package com.example.flower_shop.model;
import lombok.*;
import jakarta.persistence.*;
import java.util.Date;
@Data

@Entity
@Table(name="orders")
public class Porosi {
    
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)

private Integer id;

@ManyToOne
@JoinColumn(name = "klienti_id")
private Customer klienti;

@Column(name = "data_porosis")
private Date dataPorosise;

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
