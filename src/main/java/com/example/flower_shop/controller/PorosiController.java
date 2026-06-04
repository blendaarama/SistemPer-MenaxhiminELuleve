package com.example.flower_shop.controller;

import com.example.flower_shop.dto.PorosiUpdateDTO;
import com.example.flower_shop.model.Porosi;
import com.example.flower_shop.service.PorosiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/porosi")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
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

        if (porosi == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(porosi);
    }

    @PostMapping
    public ResponseEntity<Porosi> create(@RequestBody Porosi porosi) {
        Porosi saved = service.create(porosi);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Porosi> update(
            @PathVariable Integer id,
            @RequestBody PorosiUpdateDTO dto
    ) {
        Porosi updated = service.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        boolean deleted = service.delete(id);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}