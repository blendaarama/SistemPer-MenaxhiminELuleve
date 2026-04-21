package com.example.flower_shop.model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;
@Data


@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "orderdetails")
public class OrderDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

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
}