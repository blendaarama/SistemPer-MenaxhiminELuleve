package com.example.flower_shop.dto;

import lombok.Data;

@Data
public class ReviewDTO {

    private Integer klientiId;
    private Integer porosiaId;

    private Integer vleresimi;
    private String komenti;
}