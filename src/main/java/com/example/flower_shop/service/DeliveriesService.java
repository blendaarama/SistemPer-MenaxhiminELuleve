package com.example.flower_shop.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.flower_shop.dto.DeliveriesDTO;
import com.example.flower_shop.model.Deliveries;
import com.example.flower_shop.model.Porosi;
import com.example.flower_shop.model.Supplier;
import com.example.flower_shop.repository.DeliveriesRepository;
import com.example.flower_shop.repository.PorosiRepository;
import com.example.flower_shop.repository.SupplierRepository;

@Service
public class DeliveriesService {

    @Autowired
    private DeliveriesRepository repository;

    @Autowired
    private PorosiRepository porosiRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    public List<Deliveries> getAll() {
        return repository.findAll();
    }

    public Deliveries getById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    // CREATE ME DTO (PRO VERSION)
    public Deliveries create(DeliveriesDTO dto) {

        Deliveries d = new Deliveries();

        Porosi porosi = porosiRepository.findById(dto.getPorosiaId()).orElse(null);
        Supplier korrieri = supplierRepository.findById(dto.getKorrieriId()).orElse(null);

        d.setPorosia(porosi);
        d.setKorrieri(korrieri);

        d.setDataDorezimit(dto.getDataDorezimit());
        d.setOraDorezimit(dto.getOraDorezimit());
        d.setStatusi(dto.getStatusi());
        d.setFirmaPranuesit(dto.getFirmaPranuesit());

        return repository.save(d);
    }

    public Deliveries update(Integer id, DeliveriesDTO dto) {

        Deliveries existing = getById(id);
        if (existing == null) return null;

        Porosi porosi = porosiRepository.findById(dto.getPorosiaId()).orElse(null);
        Supplier korrieri = supplierRepository.findById(dto.getKorrieriId()).orElse(null);

        existing.setPorosia(porosi);
        existing.setKorrieri(korrieri);

        existing.setDataDorezimit(dto.getDataDorezimit());
        existing.setOraDorezimit(dto.getOraDorezimit());
        existing.setStatusi(dto.getStatusi());
        existing.setFirmaPranuesit(dto.getFirmaPranuesit());

        return repository.save(existing);
    }

    public boolean delete(Integer id) {

        Deliveries existing = getById(id);
        if (existing == null) return false;

        repository.delete(existing);
        return true;
    }
}