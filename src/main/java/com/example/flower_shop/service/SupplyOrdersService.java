package com.example.flower_shop.service;

import com.example.flower_shop.dto.SupplyOrdersDTO;
import com.example.flower_shop.model.SupplyOrders;
import com.example.flower_shop.model.Supplier;
import com.example.flower_shop.repository.SupplyOrdersRepository;
import com.example.flower_shop.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplyOrdersService {

    private final SupplyOrdersRepository repository;
    private final SupplierRepository supplierRepository;

    public SupplyOrdersService(SupplyOrdersRepository repository, SupplierRepository supplierRepository) {
        this.repository = repository;
        this.supplierRepository = supplierRepository;
    }

    public List<SupplyOrdersDTO> getAllOrders() {
        return repository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public SupplyOrdersDTO getOrderById(Integer id) {
        SupplyOrders order = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Porosia nuk u gjet"));
        return convertToDTO(order);
    }

    public SupplyOrdersDTO createOrder(SupplyOrdersDTO dto) {
        SupplyOrders order = new SupplyOrders();
        Supplier supplier = supplierRepository.findById(dto.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Furnitori nuk u gjet"));
        
        order.setFurnitori(supplier);
        order.setDataPorosis(dto.getDataPorosis());
        order.setShumaTotale(dto.getShumaTotale());
        order.setStatusi(dto.getStatusi());
        
        return convertToDTO(repository.save(order));
    }

    public void deleteOrder(Integer id) {
        repository.deleteById(id);
    }

    private SupplyOrdersDTO convertToDTO(SupplyOrders order) {
        SupplyOrdersDTO dto = new SupplyOrdersDTO();
        dto.setId(order.getId());
        dto.setDataPorosis(order.getDataPorosis());
        dto.setShumaTotale(order.getShumaTotale());
        dto.setStatusi(order.getStatusi());
        if (order.getFurnitori() != null) {
            dto.setSupplierId(order.getFurnitori().getId());
            dto.setSupplierName(order.getFurnitori().getEmertimi());
        }
        return dto;
    }
}