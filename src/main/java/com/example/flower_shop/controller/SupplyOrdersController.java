package com.example.flower_shop.controller;

import com.example.flower_shop.dto.SupplyOrdersDTO;
import com.example.flower_shop.service.SupplyOrdersService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/supply-orders")
public class SupplyOrdersController {

    private final SupplyOrdersService service;

    public SupplyOrdersController(SupplyOrdersService service) {
        this.service = service;
    }

    @GetMapping
    public List<SupplyOrdersDTO> getAll() {
        return service.getAllOrders();
    }

    @GetMapping("/{id}")
    public SupplyOrdersDTO getById(@PathVariable Integer id) {
        return service.getOrderById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SupplyOrdersDTO create(@RequestBody SupplyOrdersDTO dto) {
        return service.createOrder(dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        service.deleteOrder(id);
    }
}