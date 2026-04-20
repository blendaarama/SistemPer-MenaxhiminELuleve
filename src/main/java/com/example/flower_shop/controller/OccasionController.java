package com.example.flower_shop.controller;

import com.example.flower_shop.model.Occasion;
import com.example.flower_shop.repository.OccasionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/occasions")
@CrossOrigin(origins = "http://localhost:3000")
public class OccasionController {
    
    private final OccasionRepository occasionRepository;

    OccasionController(OccasionRepository occasionRepository){
        this.occasionRepository = occasionRepository;
    }

    @GetMapping
    public List<Occasion> getAllOccasions(){
        return occasionRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Occasion addOccasion(@RequestBody Occasion occasion){
        return occasionRepository.save(occasion);
    }

    @GetMapping("/{id}")
    public Occasion getOccasionById(@PathVariable Integer id){
        return occasionRepository.findById(id).orElse(null);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOccasion(@PathVariable Integer id){
        if(occasionRepository.existsById(id)){
            occasionRepository.deleteById(id);
        }
    }

    @PutMapping("/{id}")
    public Occasion updateOccasion(@PathVariable Integer id,@RequestBody Occasion occasionDetails){
        Occasion occasion = occasionRepository.findById(id).orElse(null);
        if(occasion != null){
            occasion.setEmertimi(occasionDetails.getEmertimi());
            occasion.setPershkrimi(occasionDetails.getPershkrimi());
            occasion.setDataNgjarjes(occasionDetails.getDataNgjarjes());
            occasion.setZbritjaPerqindje(occasionDetails.getZbritjaPerqindje());

            return occasionRepository.save(occasion);
        }
        return null;
    }
}
