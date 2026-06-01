package com.example.flower_shop.controller;

import com.example.flower_shop.model.Inventory;
import com.example.flower_shop.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public List<Inventory> getAll() {
        return inventoryService.getAll();
    }

    @PostMapping
    public Inventory create(@RequestBody Inventory inventory) {
        return inventoryService.create(inventory);
    }

    @PutMapping("/{id}")
    public Inventory update(
            @PathVariable Integer id,
            @RequestBody Inventory inventory
    ) {
        return inventoryService.update(id, inventory);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        inventoryService.delete(id);
    }
}