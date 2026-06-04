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
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        inventory.setFlowerId(updated.getFlowerId());
        inventory.setFlowerDescription(updated.getFlowerDescription());
        inventory.setPhysicalStock(updated.getPhysicalStock());
        inventory.setReservedOrders(updated.getReservedOrders());
        inventory.setSafetyLevel(updated.getSafetyLevel());
        inventory.setLastAuditDate(updated.getLastAuditDate());

        return inventoryRepository.save(inventory);
    }

    public void delete(Integer id) {
        inventoryRepository.deleteById(id);
    }
}