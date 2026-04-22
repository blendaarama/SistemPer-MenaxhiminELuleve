package com.example.flower_shop.service;

import com.example.flower_shop.dto.ReviewDTO;
import com.example.flower_shop.model.Customer;
import com.example.flower_shop.model.Porosi;
import com.example.flower_shop.model.Review;
import com.example.flower_shop.repository.CustomerRepository;
import com.example.flower_shop.repository.PorosiRepository;
import com.example.flower_shop.repository.ReviewRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final CustomerRepository customerRepository;
    private final PorosiRepository porosiRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         CustomerRepository customerRepository,
                         PorosiRepository porosiRepository) {
        this.reviewRepository = reviewRepository;
        this.customerRepository = customerRepository;
        this.porosiRepository = porosiRepository;
    }

    // GET ALL
    public List<Review> getAll() {
        return reviewRepository.findAll();
    }

    // GET BY ID
    public Review getById(Integer id) {
        return reviewRepository.findById(id).orElse(null);
    }

    // CREATE (ME DTO)
    public Review create(ReviewDTO dto) {

        Customer klienti = customerRepository.findById(dto.getKlientiId()).orElse(null);
        Porosi porosia = porosiRepository.findById(dto.getPorosiaId()).orElse(null);

        if (klienti == null || porosia == null) return null;

        Review review = new Review();
        review.setKlienti(klienti);
        review.setPorosia(porosia);
        review.setVleresimi(dto.getVleresimi());
        review.setKomenti(dto.getKomenti());

        return reviewRepository.save(review);
    }

    // UPDATE
    public Review update(Integer id, ReviewDTO dto) {

        Review existing = getById(id);
        if (existing == null) return null;

        Customer klienti = customerRepository.findById(dto.getKlientiId()).orElse(null);
        Porosi porosia = porosiRepository.findById(dto.getPorosiaId()).orElse(null);

        if (klienti == null || porosia == null) return null;

        existing.setKlienti(klienti);
        existing.setPorosia(porosia);
        existing.setVleresimi(dto.getVleresimi());
        existing.setKomenti(dto.getKomenti());

        return reviewRepository.save(existing);
    }

    // DELETE
    public boolean delete(Integer id) {
        Review existing = getById(id);
        if (existing == null) return false;

        reviewRepository.delete(existing);
        return true;
    }
}