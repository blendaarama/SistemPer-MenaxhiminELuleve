package com.example.flower_shop.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class SupplyOrdersDTO {
    private Integer id;
    private Integer supplierId;
    private String supplierName;
    private LocalDate dataPorosis;
    private Double shumaTotale;
    private String statusi;
}