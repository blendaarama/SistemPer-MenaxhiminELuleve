package com.example.flower_shop.dto;
import lombok.Data;
import java.util.List;

@Data
public class BouquetDTO {
    private Integer id;
    private String emertimi;
    private String pershkrimi;
    private Double cmimi;
    private String madhesia;
    private String foto;
    private Boolean eshteAktiv;
    private List<String> emratELuleve;
    private List<Integer> flowerIds;
}