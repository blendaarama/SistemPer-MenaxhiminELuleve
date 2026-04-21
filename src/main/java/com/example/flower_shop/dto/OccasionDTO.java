package com.example.flower_shop.dto;
import lombok.Data;
import java.time.LocalDate;

@Data
public class OccasionDTO {
    private Integer id;
    private String emertimi;
    private String pershkrimi;
    private LocalDate dataNgjarjes;
    private Double zbritjaPerqindje;
}