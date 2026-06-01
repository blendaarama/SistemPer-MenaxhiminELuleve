package com.example.flower_shop.model;
import com.example.flower_shop.model.Porosi;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "payments")
@Data
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Double amount;

    private String paymentMethod;

    private String status;

    @ManyToOne
    @JoinColumn(name = "porosia_id")
    private Porosi porosia;
}