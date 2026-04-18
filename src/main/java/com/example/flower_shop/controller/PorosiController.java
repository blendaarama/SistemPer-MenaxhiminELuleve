package com.example.flower_shop.controller;
import com.example.flower_shop.model.Porosi;
import com.example.flower_shop.repository.PorosiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/porosi")
public class PorosiController {

    @Autowired private PorosiRepository repository;

    @GetMapping 
    public List<Porosi> getAll(){
        return repository.findAll();
    }

    @PostMapping  
      public Porosi save(@RequestBody Porosi p){
        return repository.save(p);
      }//post(shto porosi)

    @GetMapping("/{id}")
    public Porosi getById(@PathVariable Long id){
        return repository.findById(id).orElse(null);

    }//get by id

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        repository.deleteById(id);
    }//delete by id
@PutMapping("/{id}")
public Porosi update(@PathVariable Long id, @RequestBody Porosi p){
    Porosi ekzistuese = repository.findById(id).orElse(null);

    if(ekzistuese !=null){
        ekzistuese.setStatusi(p.getStatusi());
        ekzistuese.setShumeTotale(p.getShumeTotale());
        ekzistuese.setAdresaDorezimit(p.getAdresaDorezimit());
        
        return repository.save(ekzistuese);
    }
    return null;
}

}
