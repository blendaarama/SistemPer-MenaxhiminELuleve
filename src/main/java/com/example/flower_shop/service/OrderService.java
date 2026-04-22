package com.example.flower_shop.service;
import com.example.flower_shop.dto.PorosiUpdateDTO;
import com.example.flower_shop.model.Porosi;
import com.example.flower_shop.repository.PorosiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private PorosiRepository repository;

    public List<Porosi> getAll() {
        return repository.findAll();
    }

    public Porosi getById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public Porosi create(Porosi porosi) {
        return repository.save(porosi);
    }

    public Porosi update(Integer id, PorosiUpdateDTO dto) {

    Porosi existing = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Porosi not found"));

    existing.setStatusi(dto.getStatusi());
    existing.setShumeTotale(dto.getShumeTotale());
    existing.setAdresaDorezimit(dto.getAdresaDorezimit());

    return repository.save(existing);
}

    public boolean delete(Integer id) {
        Porosi existing = getById(id);

        if (existing == null) return false;

        repository.delete(existing);
        return true;
    }
}