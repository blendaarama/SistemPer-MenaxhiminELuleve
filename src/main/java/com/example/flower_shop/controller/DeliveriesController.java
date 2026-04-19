package com.example.flower_shop.controller;

import com.example.flower_shop.model.Deliveries;
import com.example.flower_shop.repository.DeliveriesRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/deliveries")
@CrossOrigin(origins = "http://localhost:3000")
public class DeliveriesController {

    @Autowired
    private DeliveriesRepository deliveriesRepository;

    // Merr krejt deliveries
    @GetMapping
    public List<Deliveries> getAllDeliveries() {
        return deliveriesRepository.findAll();
    }

    // Merr delivery sipas ID
    @GetMapping("/{id}")
    public Deliveries getDeliveryById(@PathVariable Integer id) {
        Optional<Deliveries> delivery = deliveriesRepository.findById(id);
        return delivery.orElse(null);
    }

    // Shto delivery të ri
    @PostMapping
    public Deliveries createDelivery(@RequestBody Deliveries delivery) {
        return deliveriesRepository.save(delivery);
    }

    // Update delivery
    @PutMapping("/{id}")
    public Deliveries updateDelivery(@PathVariable Integer id, @RequestBody Deliveries updatedDelivery) {
        return deliveriesRepository.findById(id).map(delivery -> {
            delivery.setPorosia(updatedDelivery.getPorosia());
            delivery.setKorrieri(updatedDelivery.getKorrieri());
            delivery.setDataDorezimit(updatedDelivery.getDataDorezimit());
            delivery.setOraDorezimit(updatedDelivery.getOraDorezimit());
            delivery.setStatusi(updatedDelivery.getStatusi());
            delivery.setFirmaPranuesit(updatedDelivery.getFirmaPranuesit());
            return deliveriesRepository.save(delivery);
        }).orElse(null);
    }
    //Fshi delivery
    @DeleteMapping("/{id}")
    public void deleteDelivery(@PathVariable Integer id) {
        deliveriesRepository.deleteById(id);
    }
}