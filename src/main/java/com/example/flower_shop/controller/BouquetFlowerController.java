package com.example.flower_shop.controller;

import com.example.flower_shop.model.BouquetFlower;
import com.example.flower_shop.repository.BouquetFlowerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bouquet-flowers")
@CrossOrigin(origins = "http://localhost:3000")
public class BouquetFlowerController {

    @Autowired
    private BouquetFlowerRepository bouquetFlowerRepository;

    @GetMapping //get merr te dhena
    public List<BouquetFlower> getAll() {
        return bouquetFlowerRepository.findAll();
    }

    @GetMapping("/bouquet/{bouquetId}")
    public List<BouquetFlower> getByBouquet(@PathVariable Long bouquetId) {
        return bouquetFlowerRepository.findByBouquetId(bouquetId);
    }

    @PostMapping //shto te dhena
    public BouquetFlower addFlowerToBouquet(@RequestBody BouquetFlower bouquetFlower) {
        return bouquetFlowerRepository.save(bouquetFlower);
    }

    @DeleteMapping("/{id}") //fshije te dhena
    public void removeFlowerFromBouquet(@PathVariable Long id) {
        if(bouquetFlowerRepository.existsById(id)){
            bouquetFlowerRepository.deleteById(id);
        }
    }
}