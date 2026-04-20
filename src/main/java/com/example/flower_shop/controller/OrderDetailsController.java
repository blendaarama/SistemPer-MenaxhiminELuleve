package com.example.flower_shop.controller;

import com.example.flower_shop.model.OrderDetails;
import com.example.flower_shop.repository.OrderDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-details")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderDetailsController {

    @Autowired
    private OrderDetailsRepository repository;

    // GET ALL
    @GetMapping
    public List<OrderDetails> getAll() {
        return repository.findAll();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<OrderDetails> getById(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE
    @PostMapping
    public OrderDetails create(@RequestBody OrderDetails od) {
        return repository.save(od);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<OrderDetails> update(
            @PathVariable Long id,
            @RequestBody OrderDetails updated) {

        return repository.findById(id)
                .map(existing -> {

                    existing.setSasia(updated.getSasia());
                    existing.setCmimiNjesi(updated.getCmimiNjesi());
                    existing.setShuma(updated.getShuma());

                    existing.setPorosi(updated.getPorosi());
                    existing.setBuqeta(updated.getBuqeta());
                    existing.setFlower(updated.getFlower());

                    return ResponseEntity.ok(repository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

 @DeleteMapping("/{id}")
public ResponseEntity<Void> delete(@PathVariable Long id) {

    return repository.findById(id)
            .map(existing -> {
                repository.delete(existing);
                return ResponseEntity.noContent().<Void>build();
            })
            .orElse(ResponseEntity.notFound().build());
}
}