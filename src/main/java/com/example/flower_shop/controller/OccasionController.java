package com.example.flower_shop.controller;

import com.example.flower_shop.dto.OccasionDTO;
import com.example.flower_shop.service.OccasionService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/occasions")
@CrossOrigin(origins = "http://localhost:3000")
public class OccasionController {
    
    private final OccasionService occasionService;

    public OccasionController(OccasionService occasionService){
        this.occasionService = occasionService;
    }

    @GetMapping
    public List<OccasionDTO> getAllOccasions(){
        return occasionService.getAllOccasions();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OccasionDTO addOccasion(@RequestBody OccasionDTO occasionDTO){
        return occasionService.addOccasion(occasionDTO);
    }

    @GetMapping("/{id}")
    public OccasionDTO getOccasionById(@PathVariable Integer id){
        return occasionService.getOccasionById(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOccasion(@PathVariable Integer id){
        occasionService.deleteOccasion(id);
    }

    @PutMapping("/{id}")
    public OccasionDTO updateOccasion(@PathVariable Integer id, @RequestBody OccasionDTO occasionDTO){
        return occasionService.updateOccasion(id, occasionDTO);
    }
}