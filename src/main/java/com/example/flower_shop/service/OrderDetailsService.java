package com.example.flower_shop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

import com.example.flower_shop.dto.OrderDetailsDTO;
import com.example.flower_shop.model.OrderDetails;
import com.example.flower_shop.repository.OrderDetailsRepository;

@Service
public class OrderDetailsService {
    

    @Autowired
    private OrderDetailsRepository repository;


    public List<OrderDetails>getAll(){
        return repository.findAll();
    }
    public OrderDetails getById(Integer id){
        return repository.findById(id).orElse(null);
    }
    public OrderDetails create(OrderDetails od){
        return repository.save(od);
    }
    public OrderDetails update(Integer id, OrderDetailsDTO dto) {

        OrderDetails existing = repository.findById(id)
                .orElse(null);

        if (existing == null) return null;

        existing.setSasia(dto.getSasia());
        existing.setCmimi_njesi(dto.getCmimiNjesi());
        existing.setShuma(dto.getShuma());

        return repository.save(existing);
    }

    public boolean delete(Integer id){
        OrderDetails existing=getById(id);

        if(existing == null) return false;
        repository.delete(existing);
        return true;
    }
}
