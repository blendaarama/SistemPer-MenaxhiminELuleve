package com.example.flower_shop.controller;

import com.example.flower_shop.model.Bouquet;
import com.example.flower_shop.repository.BouquetRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/bouquets")
@CrossOrigin(origins = "http://localhost:3000") // leje komunikimi me front
public class BouquetController {

    private BouquetRepository bouquetRepository;
    BouquetController(BouquetRepository bouquetRepository){
        this.bouquetRepository = bouquetRepository;
    }

    @GetMapping
    public List<Bouquet> getAllBouquets(){
        return bouquetRepository.findAll();
    }

    @GetMapping("/{id}")
    public Bouquet getBouquetById(@PathVariable Integer id){
        return bouquetRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Bouquet addBouquet(@RequestBody Bouquet bouquet){
        return bouquetRepository.save(bouquet);
    }

    @DeleteMapping("/{id}")
    public void deleteBouquet(@PathVariable Integer id){
        if(bouquetRepository.existsById(id)){
            bouquetRepository.deleteById(id);
        }
    }
    
    @PutMapping("/{id}")
    public Bouquet updateBouquet(@PathVariable Integer id, @RequestBody Bouquet bouquetDetails) {
        Bouquet bouquet = bouquetRepository.findById(id).orElse(null);
        if(bouquet != null){
            bouquet.setEmertimi(bouquetDetails.getEmertimi());
            bouquet.setPershkrimi(bouquetDetails.getPershkrimi());
            bouquet.setCmimi(bouquetDetails.getCmimi());
            bouquet.setMadhesia(bouquetDetails.getMadhesia());
            bouquet.setFoto(bouquetDetails.getFoto());
            bouquet.setEshteAktiv(bouquetDetails.getEshteAktiv());

            return bouquetRepository.save(bouquet);
        }
        return null;
    }
}
