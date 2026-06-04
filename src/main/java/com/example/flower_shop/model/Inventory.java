package com.example.flower_shop.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "inventory")
@Data
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String flowerId;

    private String flowerDescription;

    private Integer physicalStock;

    private Integer reservedOrders;

    private Integer safetyLevel;

    private LocalDate lastAuditDate;
}