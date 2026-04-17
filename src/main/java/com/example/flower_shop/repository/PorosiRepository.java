package com.example.flower_shop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.flower_shop.model.Porosi;

@Repository
public interface PorosiRepository extends JpaRepository<Porosi, Long>{

}
