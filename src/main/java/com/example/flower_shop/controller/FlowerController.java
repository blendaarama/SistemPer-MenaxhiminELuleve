package com.example.flower_shop.controller;

import com.example.flower_shop.model.Flower;
import com.example.flower_shop.repository.FlowerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flowers")
@CrossOrigin(origins = "http://localhost:3000") 
public class FlowerController {

    @Autowired
    private FlowerRepository flowerRepository;

    @GetMapping
    public List<Flower> getAllFlowers() {
        return flowerRepository.findAll();
    }

    @PostMapping
    public Flower addFlower(@RequestBody Flower flower) {
        return flowerRepository.save(flower);
    }
   
    @GetMapping("/{id}")
    public Flower getFlowerById(@PathVariable Long id) {
        return flowerRepository.findById(id).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deleteFlower(@PathVariable Long id) {
        flowerRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public Flower updateFlower(@PathVariable Long id, @RequestBody Flower flowerDetails) {
        Flower flower = flowerRepository.findById(id).orElse(null);
        if (flower != null) {
            flower.setEmertimi(flowerDetails.getEmertimi());
            flower.setLloji(flowerDetails.getLloji());
            flower.setNgjyra(flowerDetails.getNgjyra());
            flower.setCmimi(flowerDetails.getCmimi());
            flower.setSasiaStokut(flowerDetails.getSasiaStokut());
            flower.setSezoni(flowerDetails.getSezoni());
            flower.setJetegjatesiaDitesh(flowerDetails.getJetegjatesiaDitesh());
            flower.setFoto(flowerDetails.getFoto());
    
            return flowerRepository.save(flower);
        }
        return null;
    }
}