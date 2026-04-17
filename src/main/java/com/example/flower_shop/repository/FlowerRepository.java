package com.example.flower_shop.repository;

import com.example.flower_shop.model.Flower;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FlowerRepository extends JpaRepository<Flower, Long> {

}