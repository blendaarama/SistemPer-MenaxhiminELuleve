package com.example.flower_shop.controller;

import com.example.flower_shop.model.Product;
import com.example.flower_shop.repository.ProductRepository;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private final ProductRepository repository;

    public ProductController(ProductRepository repository) {
        this.repository = repository;
    }

    // ALL PRODUCTS
    @GetMapping("/all")
    public List<Product> getAll() {
        return repository.findAll();
    }

    // SEARCH (FLOWERS + BOUQUETS)
    @GetMapping("/search")
    public Map<String, List<Product>> search(@RequestParam String q) {

        List<Product> flowers = repository
                .findByCategoryIgnoreCase("flower")
                .stream()
                .filter(p -> p.getName().toLowerCase().contains(q.toLowerCase()))
                .toList();

        List<Product> bouquets = repository
                .findByCategoryIgnoreCase("bouquet")
                .stream()
                .filter(p -> p.getName().toLowerCase().contains(q.toLowerCase()))
                .toList();

        Map<String, List<Product>> result = new HashMap<>();
        result.put("flowers", flowers);
        result.put("bouquets", bouquets);

        return result;
    }
}