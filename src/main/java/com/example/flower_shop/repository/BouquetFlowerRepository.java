package com.example.flower_shop.repository;

import com.example.flower_shop.model.BouquetFlower;
import com.example.flower_shop.model.Flower;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;./mvnw spring-boot:run

@Repository
public interface BouquetFlowerRepository extends JpaRepository<BouquetFlower, Integer> {

    List<BouquetFlower> findByBouquetId(Integer bouquetId);
}
