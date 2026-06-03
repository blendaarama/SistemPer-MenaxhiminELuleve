package com.example.flower_shop.controller;

import com.example.flower_shop.model.Porosi;
import com.example.flower_shop.service.PorosiService;
import com.example.flower_shop.dto.PorosiUpdateDTO;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/porosi")
@CrossOrigin(origins = "http://localhost:5173")
public class PorosiController {

    private final PorosiService service;

    public PorosiController(PorosiService service) {
        this.service = service;
    }

    @GetMapping
    public List<Porosi> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Porosi> getById(@PathVariable Integer id) {
        Porosi porosi = service.getById(id);

        return porosi != null
                ? ResponseEntity.ok(porosi)
                : ResponseEntity.notFound().build();
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

        return updated != null
                ? ResponseEntity.ok(updated)
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