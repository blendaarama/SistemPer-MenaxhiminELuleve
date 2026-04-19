package com.example.flower_shop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.flower_shop.model.Deliveries;

public interface DeliveriesRepository extends JpaRepository<Deliveries, Integer> {
    
}
