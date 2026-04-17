package com.example.flower_shop.controller;

import com.example.flower_shop.model.Flower;
import com.example.flower_shop.repository.FlowerRepository;

import com.example.flower_shop.repository.SupplierRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flowers")
@CrossOrigin(origins = "http://localhost:3000") 
public class FlowerController {

    private final SupplierRepository supplierRepository;
    private final FlowerRepository flowerRepository;

    FlowerController(FlowerRepository flowerRepository, SupplierRepository supplierRepository){
        this.flowerRepository = flowerRepository;
        this.supplierRepository = supplierRepository;
    }

    @GetMapping
    public List<Flower> getAllFlowers() {
        return flowerRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED) //kthen 201 per create
    public Flower addFlower(@RequestBody Flower flower) {
        return flowerRepository.save(flower);
    }
   
    @GetMapping("/{id}")
    public Flower getFlowerById(@PathVariable Long id) {
        return flowerRepository.findById(id).orElse(null);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // kthe 204 per delete sepse nuk ka body
    public void deleteFlower(@PathVariable Long id) {
        if(flowerRepository.existsById(id)){
            flowerRepository.deleteById(id);
        } 
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