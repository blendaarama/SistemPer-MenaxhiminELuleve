package com.example.flower_shop.repository;

import com.example.flower_shop.model.BouquetFlower;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List; 

@Repository
public interface BouquetFlowerRepository extends JpaRepository<BouquetFlower, Long> {
    List<BouquetFlower> findByBouquetId(Integer bouquetId);
}