package com.example.flower_shop.repository;

import com.example.flower_shop.model.Bouquet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BouquetRepository extends JpaRepository<Bouquet, Integer> {
    
} 