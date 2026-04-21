package com.example.flower_shop.service;

import com.example.flower_shop.dto.BouquetFlowerDTO;
import com.example.flower_shop.model.Bouquet;
import com.example.flower_shop.model.BouquetFlower;
import com.example.flower_shop.model.Flower;
import com.example.flower_shop.repository.BouquetFlowerRepository;
import com.example.flower_shop.repository.BouquetRepository;
import com.example.flower_shop.repository.FlowerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BouquetFlowerService {

    private final BouquetFlowerRepository bouquetFlowerRepository;
    private final FlowerRepository flowerRepository;
    private final BouquetRepository bouquetRepository;

    public BouquetFlowerService(BouquetFlowerRepository bfRepo, FlowerRepository fRepo, BouquetRepository bRepo) {
        this.bouquetFlowerRepository = bfRepo;
        this.flowerRepository = fRepo;
        this.bouquetRepository = bRepo;
    }
    
    private BouquetFlowerDTO mapToDTO(BouquetFlower bf) {
        BouquetFlowerDTO dto = new BouquetFlowerDTO();
        dto.setId(bf.getId());
        dto.setBouquetId(bf.getBouquet().getId());
        dto.setFlowerId(bf.getFlower().getId());
        dto.setSasia(bf.getSasia());
        dto.setFlowerName(bf.getFlower().getEmertimi()); 
        return dto;
    }

    public List<BouquetFlowerDTO> getAll() {
        return bouquetFlowerRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<BouquetFlowerDTO> getByBouquet(Integer bouquetId) {
        return bouquetFlowerRepository.findByBouquetId(bouquetId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public BouquetFlowerDTO addFlowerToBouquet(BouquetFlowerDTO dto) {
        Flower flower = flowerRepository.findById(dto.getFlowerId())
                .orElseThrow(() -> new RuntimeException("Lulja nuk u gjet!"));
        
        Bouquet bouquet = bouquetRepository.findById(dto.getBouquetId())
                .orElseThrow(() -> new RuntimeException("Buketi nuk u gjet!"));

        if (flower.getSasiaStokut() < dto.getSasia()) {
            throw new RuntimeException("Nuk ka mjaftueshëm stok për " + flower.getEmertimi());
        }

        flower.setSasiaStokut(flower.getSasiaStokut() - dto.getSasia());
        flowerRepository.save(flower);

        BouquetFlower bf = new BouquetFlower();
        bf.setBouquet(bouquet);
        bf.setFlower(flower);
        bf.setSasia(dto.getSasia());

        BouquetFlower saved = bouquetFlowerRepository.save(bf);
        return mapToDTO(saved);
    }

    @Transactional
    public void removeFlowerFromBouquet(Integer id) {
        BouquetFlower bf = bouquetFlowerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lidhja nuk ekziston!"));

        Flower flower = bf.getFlower();
        flower.setSasiaStokut(flower.getSasiaStokut() + bf.getSasia());
        flowerRepository.save(flower);

        bouquetFlowerRepository.deleteById(id);
    }
}