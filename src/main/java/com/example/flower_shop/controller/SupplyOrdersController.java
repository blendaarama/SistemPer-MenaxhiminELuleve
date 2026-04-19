package com.example.flower_shop.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.flower_shop.model.SupplyOrders;
import com.example.flower_shop.repository.SupplyOrdersRepository;

@RestController
@RequestMapping("/api/supplyorders")
@CrossOrigin(origins = "http://localhost:3000")
public class SupplyOrdersController {

    @Autowired
    private SupplyOrdersRepository supplyOrdersRepository;

    @GetMapping
    public List<SupplyOrders> getAllSupplyOrders() {
        return supplyOrdersRepository.findAll();
    }

    @GetMapping("/{id}")
    public SupplyOrders getSupplyOrderById(@PathVariable Integer id) {
        Optional<SupplyOrders> order = supplyOrdersRepository.findById(id);
        return order.orElse(null);
    }

    @PostMapping
    public SupplyOrders createSupplyOrder(@RequestBody SupplyOrders order) {
        return supplyOrdersRepository.save(order);
    }

    @PutMapping("/{id}")
    public SupplyOrders updateSupplyOrder(@PathVariable Integer id, @RequestBody SupplyOrders updatedOrder) {
        return supplyOrdersRepository.findById(id).map(order -> {
            order.setFurnitori(updatedOrder.getFurnitori());
            order.setDataPorosis(updatedOrder.getDataPorosis());
            order.setShumaTotale(updatedOrder.getShumaTotale());
            order.setStatusi(updatedOrder.getStatusi());
            return supplyOrdersRepository.save(order);
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deleteSupplyOrder(@PathVariable Integer id) {
        supplyOrdersRepository.deleteById(id);
    }
}