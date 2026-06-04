package com.example.flower_shop.controller;

import com.example.flower_shop.model.Inventory;
import com.example.flower_shop.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<Inventory>> getAll() {
        return ResponseEntity.ok(inventoryService.getAll());
    }

    @PostMapping
    public ResponseEntity<Inventory> create(@RequestBody Inventory inventory) {
        return ResponseEntity.ok(inventoryService.create(inventory));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Inventory> update(
            @PathVariable Integer id,
            @RequestBody Inventory inventory
    ) {
        return ResponseEntity.ok(inventoryService.update(id, inventory));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        inventoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}