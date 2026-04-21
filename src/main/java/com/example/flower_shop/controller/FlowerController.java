package com.example.flower_shop.controller;

import com.example.flower_shop.dto.FlowerDTO;
import com.example.flower_shop.service.FlowerService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/flowers")
@CrossOrigin(origins = "http://localhost:3000") 
public class FlowerController {

    private final FlowerService flowerService;

    public FlowerController(FlowerService flowerService){
        this.flowerService = flowerService;
    }

    @GetMapping
    public List<FlowerDTO> getAllFlowers() {
        return flowerService.getAllFlowers();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FlowerDTO addFlower(@RequestBody FlowerDTO flowerDTO) {
        return flowerService.addFlower(flowerDTO);
    }
   
    @GetMapping("/{id}")
    public FlowerDTO getFlowerById(@PathVariable Integer id) {
        return flowerService.getFlowerById(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFlower(@PathVariable Integer id) {
        flowerService.deleteFlower(id);
    }

    @PutMapping("/{id}")
    public FlowerDTO updateFlower(@PathVariable Integer id, @RequestBody FlowerDTO flowerDTO) {
        return flowerService.updateFlower(id, flowerDTO);
    }
}