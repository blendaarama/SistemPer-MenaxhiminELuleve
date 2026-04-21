package com.example.flower_shop.controller;

import com.example.flower_shop.dto.dto.PorosiUpdateDTO;
import com.example.flower_shop.model.Porosi;
import com.example.flower_shop.service.OrderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/porosi")
public class PorosiController {

    @Autowired
    private OrderService service;
    @GetMapping
    public List<Porosi> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public <service> Porosi getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PostMapping
    public Porosi create(@RequestBody Porosi porosi) {
        return service.create(porosi);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Porosi> update(
            @PathVariable Integer id,
            @RequestBody PorosiUpdateDTO dto) {

        Porosi updated = service.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public boolean delete(@PathVariable Integer id) {
        return service.delete(id);
    }
}