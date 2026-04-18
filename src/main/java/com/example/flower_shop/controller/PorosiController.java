package com.example.flower_shop.controller;

import com.example.flower_shop.model.Porosi;
import com.example.flower_shop.repository.PorosiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/porosi")
public class PorosiController {

    @Autowired 
    private PorosiRepository repository;


    //GetAll
   @GetMapping 
public ResponseEntity<List<Porosi>> getAllPorosi(){
    List<Porosi> list = repository.findAll();
    return ResponseEntity.ok(list);
}

   //Get by id
   @GetMapping("/{id}")
   public ResponseEntity<Porosi> getPorosiById(@PathVariable Long id){
    return repository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
   }

   //create
   @PostMapping   
   public ResponseEntity<Porosi> createPorosi(@RequestBody Porosi porosi){
    Porosi saved=repository.save(porosi);
    return ResponseEntity.status(201).body(saved);
   }

   //update
   @PutMapping("/{id}")
   public ResponseEntity<Porosi> updatePorosi(@PathVariable Long id, @RequestBody Porosi updatePorosi){
    return repository.findById(id).map(existing -> {
        existing.setStatusi(updatePorosi.getStatusi());
        existing.setShumeTotale(updatePorosi.getShumeTotale());
        existing.setAdresaDorezimit(updatePorosi.getAdresaDorezimit());

         Porosi saved = repository.save(existing);

         return ResponseEntity.ok(saved);
    })
    .orElse(ResponseEntity.notFound().build());
   }
    // delete
    @DeleteMapping("/{id}")
     public ResponseEntity<?> deletePorosi(@PathVariable Long id) {

        return repository.findById(id)
                .map(existing -> {
                    repository.delete(existing);
                       return ResponseEntity.noContent().build(); // 204
         })
         .orElse(ResponseEntity.notFound().build());
    }

}
