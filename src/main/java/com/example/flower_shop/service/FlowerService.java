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
        dto.setCmimi(flower.getCmimi());
        dto.setSasiaStokut(flower.getSasiaStokut());
        dto.setFoto(flower.getFoto());
        return dto;
    }

    public List<FlowerDTO> getAllFlowers() {
        return flowerRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public FlowerDTO getFlowerById(Integer id) {
        return flowerRepository.findById(id)
                .map(this::mapToDTO)
                .orElse(null);
    }

    public FlowerDTO addFlower(FlowerDTO dto) {
        Flower flower = new Flower();
        flower.setEmertimi(dto.getEmertimi());
        flower.setCmimi(dto.getCmimi());
        flower.setSasiaStokut(dto.getSasiaStokut());
        flower.setFoto(dto.getFoto());

        Flower savedFlower = flowerRepository.save(flower);
        dto.setId(savedFlower.getId());
        return dto;
    }

    public void deleteFlower(Integer id) {
        if (flowerRepository.existsById(id)) {
            flowerRepository.deleteById(id);
        }
    }

    public FlowerDTO updateFlower(Integer id, FlowerDTO dto) {
        Flower flower = flowerRepository.findById(id).orElse(null);
        if (flower != null) {
            flower.setEmertimi(dto.getEmertimi());
            flower.setCmimi(dto.getCmimi());
            flower.setSasiaStokut(dto.getSasiaStokut());
            flower.setFoto(dto.getFoto());
            
            Flower updatedFlower = flowerRepository.save(flower);
            return mapToDTO(updatedFlower);
        }
        return null;
    }
}