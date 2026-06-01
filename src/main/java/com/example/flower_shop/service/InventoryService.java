package com.example.flower_shop.service;

import com.example.flower_shop.model.Inventory;
import com.example.flower_shop.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public List<Inventory> getAll() {
        return inventoryRepository.findAll();
    }

    public Inventory create(Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    public Inventory update(Integer id, Inventory updated) {

        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow();

        inventory.setFlowerName(updated.getFlowerName());
        inventory.setQuantity(updated.getQuantity());
        inventory.setStatus(updated.getStatus());

        return inventoryRepository.save(inventory);
    }

    public void delete(Integer id) {
        inventoryRepository.deleteById(id);
    }
}