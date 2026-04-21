package com.example.flower_shop.controller;

import com.example.flower_shop.dto.BouquetDTO;
import com.example.flower_shop.service.BouquetService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bouquets")
@CrossOrigin(origins = "http://localhost:3000")
public class BouquetController {

    private final BouquetService bouquetService;

    public BouquetController(BouquetService bouquetService) {
        this.bouquetService = bouquetService;
    }

    @GetMapping
    public List<BouquetDTO> getAllBouquets() {
        return bouquetService.getAllBouquets();
    }

    @GetMapping("/{id}")
    public BouquetDTO getBouquetById(@PathVariable Integer id) {
        return bouquetService.getBouquetById(id);
    }

    @PostMapping
    public BouquetDTO addBouquet(@RequestBody BouquetDTO bouquetDTO) {
        return bouquetService.addBouquet(bouquetDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteBouquet(@PathVariable Integer id) {
        bouquetService.deleteBouquet(id);
    }

    @PutMapping("/{id}")
    public BouquetDTO updateBouquet(@PathVariable Integer id, @RequestBody BouquetDTO bouquetDTO) {
        return bouquetService.updateBouquet(id, bouquetDTO);
    }
}