package com.example.flower_shop.service;

import com.example.flower_shop.dto.SupplierDTO;
import com.example.flower_shop.model.Supplier;
import com.example.flower_shop.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    private SupplierDTO mapToDTO(Supplier supplier) {
        SupplierDTO dto = new SupplierDTO();
        dto.setId(supplier.getId());
        dto.setEmertimi(supplier.getEmertimi());
        dto.setKontakti(supplier.getKontakti());
        dto.setEmail(supplier.getEmail());
        dto.setTelefoni(supplier.getTelefoni());
        dto.setAdresa(supplier.getAdresa());
        return dto;
    }

    public List<SupplierDTO> getAllSuppliers() {
        return supplierRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public SupplierDTO getSupplierById(Integer id) {
        return supplierRepository.findById(id)
                .map(this::mapToDTO)
                .orElse(null);
    }

    public SupplierDTO addSupplier(SupplierDTO dto) {
        Supplier supplier = new Supplier();
        supplier.setEmertimi(dto.getEmertimi());
        supplier.setKontakti(dto.getKontakti());
        supplier.setEmail(dto.getEmail());
        supplier.setTelefoni(dto.getTelefoni());
        supplier.setAdresa(dto.getAdresa());

        Supplier saved = supplierRepository.save(supplier);
        dto.setId(saved.getId());
        return dto;
    }

    public void deleteSupplier(Integer id) {
        if (supplierRepository.existsById(id)) {
            supplierRepository.deleteById(id);
        }
    }

    public SupplierDTO updateSupplier(Integer id, SupplierDTO dto) {
        Supplier supplier = supplierRepository.findById(id).orElse(null);
        if (supplier != null) {
            supplier.setEmertimi(dto.getEmertimi());
            supplier.setKontakti(dto.getKontakti());
            supplier.setEmail(dto.getEmail());
            supplier.setTelefoni(dto.getTelefoni());
            supplier.setAdresa(dto.getAdresa());

            Supplier updated = supplierRepository.save(supplier);
            return mapToDTO(updated);
        }
        return null;
    }
}