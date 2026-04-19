package com.example.flower_shop.repository;

import com.example.flower_shop.model.SupplyOrders;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplyOrdersRepository extends JpaRepository<SupplyOrders, Integer> {
}