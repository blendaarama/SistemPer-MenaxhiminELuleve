package com.example.flower_shop.controller;

import com.example.flower_shop.model.Product;
import com.example.flower_shop.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")

public class ProductController {

    private final ProductRepository repository;

    public ProductController(ProductRepository repository) {
        this.repository = repository;
    }

    // 1. Merr të gjitha produktet (për Homepage)
    @GetMapping("/all")
    public List<Product> getAll() {
        return repository.findAll();
    }

    // 2. Kërkimi (për Search Bar-in)
    @GetMapping("/search")
    public List<Product> search(@RequestParam String q) {
        return repository.findByNameContainingIgnoreCase(q);
    }
}