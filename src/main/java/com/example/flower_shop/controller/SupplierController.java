package com.example.flower_shop.controller;

import com.example.flower_shop.dto.SupplierDTO;
import com.example.flower_shop.service.SupplierService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @GetMapping
    public List<SupplierDTO> getAll() {
        return supplierService.getAllSuppliers();
    }

    @PostMapping
    public SupplierDTO add(@RequestBody SupplierDTO dto) {
        return supplierService.addSupplier(dto);
    }

    @PutMapping("/{id}")
    public SupplierDTO update(@PathVariable Integer id, @RequestBody SupplierDTO dto) {
        return supplierService.updateSupplier(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        supplierService.deleteSupplier(id);
    }
}