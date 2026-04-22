package com.example.flower_shop.dto;

import java.time.LocalTime;
import java.util.Date;

import lombok.Data;

@Data
public class DeliveriesDTO {

    private Integer porosiaId;
    private Integer korrieriId;

    private Date dataDorezimit;
    private LocalTime oraDorezimit;

    private String statusi;
    private String firmaPranuesit;
}