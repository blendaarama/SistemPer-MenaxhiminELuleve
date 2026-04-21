package com.example.flower_shop.controller;

import com.example.flower_shop.dto.BouquetFlowerDTO;
import com.example.flower_shop.service.BouquetFlowerService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bouquet-flowers")
@CrossOrigin(origins = "http://localhost:3000")
public class BouquetFlowerController {

    private final BouquetFlowerService bouquetFlowerService;

    public BouquetFlowerController(BouquetFlowerService bouquetFlowerService){
        this.bouquetFlowerService = bouquetFlowerService;
    }

    @GetMapping
    public List<BouquetFlowerDTO> getAll() {
        return bouquetFlowerService.getAll();
    }

    @GetMapping("/bouquet/{bouquetId}")
    public List<BouquetFlowerDTO> getByBouquet(@PathVariable Integer bouquetId) {
        return bouquetFlowerService.getByBouquet(bouquetId);
    }

    @PostMapping
    public BouquetFlowerDTO addFlowerToBouquet(@RequestBody BouquetFlowerDTO bouquetFlowerDTO) {
        return bouquetFlowerService.addFlowerToBouquet(bouquetFlowerDTO);
    }

    @DeleteMapping("/{id}")
    public void removeFlowerFromBouquet(@PathVariable Integer id) {
        bouquetFlowerService.removeFlowerFromBouquet(id);
    }
}