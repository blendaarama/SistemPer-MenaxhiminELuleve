package com.example.flower_shop.repository;

import com.example.flower_shop.model.BouquetFlower;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import java.util.List; 
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface BouquetFlowerRepository extends JpaRepository<BouquetFlower, Integer> {
    List<BouquetFlower> findByBouquetId(Integer bouquetId);
    
    @Transactional
    @Modifying
    void deleteByBouquetId(Integer bouquetId);
}