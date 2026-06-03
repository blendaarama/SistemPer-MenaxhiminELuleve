package com.example.flower_shop.controller;

import com.example.flower_shop.dto.DeliveriesDTO;
import com.example.flower_shop.model.Deliveries;
import com.example.flower_shop.service.DeliveriesService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@CrossOrigin(origins = "http://localhost:3000")
public class DeliveriesController {

    private final DeliveriesService service;

    public DeliveriesController(DeliveriesService service) {
        this.service = service;
    }

    @GetMapping
    public List<Deliveries> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Deliveries> getById(@PathVariable Integer id) {
        Deliveries delivery = service.getById(id);

        return delivery != null
                ? ResponseEntity.ok(delivery)
                : ResponseEntity.notFound().build();
    }

    @PostMapping
public Deliveries create(@RequestBody DeliveriesDTO dto) {
    return service.create(dto);
}

    @PutMapping("/{id}")
public ResponseEntity<Deliveries> update(
        @PathVariable Integer id,
        @RequestBody DeliveriesDTO dto) {

    Deliveries result = service.update(id, dto);

    return result != null
            ? ResponseEntity.ok(result)
            : ResponseEntity.notFound().build();
}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {

        boolean deleted = service.delete(id);

        return deleted
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}