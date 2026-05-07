package com.example.flower_shop.service;

import com.example.flower_shop.dto.SupplierDTO;
import com.example.flower_shop.model.Supplier;
import com.example.flower_shop.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplierService {

    private final SupplierRepository repository;

    public SupplierService(SupplierRepository repository) {
        this.repository = repository;
    }

    public List<SupplierDTO> getAllSuppliers() {
        return repository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public SupplierDTO getSupplierById(Integer id) {
        Supplier s = repository.findById(id).orElseThrow(() -> new RuntimeException("Nuk u gjet"));
        return convertToDTO(s);
    }

    public SupplierDTO addSupplier(SupplierDTO dto) {
        Supplier s = new Supplier();
        mapDtoToEntity(dto, s);
        return convertToDTO(repository.save(s));
    }

    public void deleteSupplier(Integer id) {
        repository.deleteById(id);
    }

    public SupplierDTO updateSupplier(Integer id, SupplierDTO dto) {
        Supplier s = repository.findById(id).orElseThrow(() -> new RuntimeException("Nuk u gjet"));
        mapDtoToEntity(dto, s);
        return convertToDTO(repository.save(s));
    }

    private SupplierDTO convertToDTO(Supplier s) {
        SupplierDTO dto = new SupplierDTO();
        dto.setId(s.getId());
        dto.setEmertimi(s.getEmertimi());
        dto.setKontakti(s.getKontakti());
        dto.setEmail(s.getEmail());
        dto.setTelefoni(s.getTelefoni());
        dto.setAdresa(s.getAdresa());
        return dto;
    }

    private void mapDtoToEntity(SupplierDTO dto, Supplier s) {
        s.setEmertimi(dto.getEmertimi());
        s.setKontakti(dto.getKontakti());
        s.setEmail(dto.getEmail());
        s.setTelefoni(dto.getTelefoni());
        s.setAdresa(dto.getAdresa());
    }
}