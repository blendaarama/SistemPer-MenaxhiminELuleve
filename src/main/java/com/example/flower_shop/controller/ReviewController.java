package com.example.flower_shop.controller;

import com.example.flower_shop.dto.ReviewDTO;
import com.example.flower_shop.model.Review;
import com.example.flower_shop.service.ReviewService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {

    private final ReviewService service;

    public ReviewController(ReviewService service) {
        this.service = service;
    }

    // GET ALL
    @GetMapping
    public List<Review> getAll() {
        return service.getAll();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Review> getById(@PathVariable Integer id) {
        Review review = service.getById(id);
        return review != null
                ? ResponseEntity.ok(review)
                : ResponseEntity.notFound().build();
    }

    // CREATE
    @PostMapping
    public ResponseEntity<Review> create(@RequestBody ReviewDTO dto) {
        Review created = service.create(dto);
        return created != null
                ? ResponseEntity.ok(created)
                : ResponseEntity.badRequest().build();
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Review> update(
            @PathVariable Integer id,
            @RequestBody ReviewDTO dto) {

        Review updated = service.update(id, dto);
        return updated != null
                ? ResponseEntity.ok(updated)
                : ResponseEntity.notFound().build();
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        boolean deleted = service.delete(id);
        return deleted
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}