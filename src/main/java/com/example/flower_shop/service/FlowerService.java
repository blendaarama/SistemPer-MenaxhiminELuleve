package com.example.flower_shop.service;

import com.example.flower_shop.dto.FlowerDTO;
import com.example.flower_shop.model.Flower;
import com.example.flower_shop.repository.FlowerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FlowerService {
    private final FlowerRepository flowerRepository;

    public FlowerService(FlowerRepository flowerRepository) {
        this.flowerRepository = flowerRepository;
    }

    private FlowerDTO mapToDTO(Flower flower) {
        FlowerDTO dto = new FlowerDTO();
        dto.setId(flower.getId());
        dto.setEmertimi(flower.getEmertimi());
        dto.setLloji(flower.getLloji());
        dto.setNgjyra(flower.getNgjyra());
        dto.setCmimi(flower.getCmimi());
        dto.setSasiaStokut(flower.getSasiaStokut());
        dto.setSezoni(flower.getSezoni());
        dto.setJetegjatesiaDitesh(flower.getJetegjatesiaDitesh());
        dto.setFoto(flower.getFoto());
        return dto;
    }

    public FlowerDTO addFlower(FlowerDTO dto) {
        Flower f = new Flower();
        copyDtoToEntity(dto, f);
        Flower saved = flowerRepository.save(f);
        return mapToDTO(saved);
    }

    public FlowerDTO updateFlower(Integer id, FlowerDTO dto) {
        return flowerRepository.findById(id).map(f -> {
            copyDtoToEntity(dto, f);
            return mapToDTO(flowerRepository.save(f));
        }).orElse(null);
    }

    private void copyDtoToEntity(FlowerDTO dto, Flower f) {
        f.setEmertimi(dto.getEmertimi());
        f.setLloji(dto.getLloji());
        f.setNgjyra(dto.getNgjyra());
        f.setCmimi(dto.getCmimi());
        f.setSasiaStokut(dto.getSasiaStokut());
        f.setSezoni(dto.getSezoni());
        f.setJetegjatesiaDitesh(dto.getJetegjatesiaDitesh());
        f.setFoto(dto.getFoto());
    }

    public List<FlowerDTO> getAllFlowers() {
        return flowerRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public FlowerDTO getFlowerById(Integer id) {
        return flowerRepository.findById(id).map(this::mapToDTO).orElse(null);
    }

    public void deleteFlower(Integer id) {
        flowerRepository.deleteById(id);
    }
}