package com.example.flower_shop.repository;

import com.example.flower_shop.model.Porosi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List; // MOS HARRO KËTË IMPORT!

@Repository
public interface PorosiRepository extends JpaRepository<Porosi, Integer> {
    
    List<Porosi> findByStatusContainingIgnoreCase(String query);
    
} 