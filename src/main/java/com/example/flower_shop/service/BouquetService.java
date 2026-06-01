package com.example.flower_shop.service;

import com.example.flower_shop.dto.BouquetDTO;
import com.example.flower_shop.dto.BouquetFlowerRequestDTO;
import com.example.flower_shop.model.Bouquet;
import com.example.flower_shop.model.BouquetFlower;
import com.example.flower_shop.model.Flower;
import com.example.flower_shop.repository.BouquetFlowerRepository;
import com.example.flower_shop.repository.BouquetRepository;
import com.example.flower_shop.repository.FlowerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BouquetService {

    private final BouquetRepository bouquetRepository;
    private final FlowerRepository flowerRepository;
    private final BouquetFlowerRepository bouquetFlowerRepository;

    public BouquetService(BouquetRepository bouquetRepository,
                          FlowerRepository flowerRepository,
                          BouquetFlowerRepository bouquetFlowerRepository) {
        this.bouquetRepository = bouquetRepository;
        this.flowerRepository = flowerRepository;
        this.bouquetFlowerRepository = bouquetFlowerRepository;
    }

    // ================= DTO MAPPING =================
    private BouquetDTO mapToDTO(Bouquet bouquet) {

        BouquetDTO dto = new BouquetDTO();

        dto.setId(bouquet.getId());
        dto.setEmertimi(bouquet.getEmertimi());
        dto.setPershkrimi(bouquet.getPershkrimi());
        dto.setCmimi(bouquet.getCmimi());
        dto.setMadhesia(bouquet.getMadhesia());
        dto.setFoto(bouquet.getFoto());
        dto.setEshteAktiv(bouquet.getEshteAktiv());

        List<String> emrat = bouquetFlowerRepository.findByBouquetId(bouquet.getId())
                .stream()
                .map(bf -> bf.getFlower().getEmertimi())
                .collect(Collectors.toList());

        dto.setEmratELuleve(emrat);

        return dto;
    }

    // ================= GET ALL =================
    public List<BouquetDTO> getAllBouquets() {
        return bouquetRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ================= GET BY ID =================
    public BouquetDTO getBouquetById(Integer id) {
        return bouquetRepository.findById(id)
                .map(this::mapToDTO)
                .orElse(null);
    }

    // ================= CREATE =================
    @Transactional
    public BouquetDTO addBouquet(BouquetDTO dto) {

        if (dto.getFlowers() == null) {
            dto.setFlowers(new ArrayList<>());
        }

        Bouquet bouquet = new Bouquet();
        copyDtoToEntity(dto, bouquet);

        Bouquet saved = bouquetRepository.save(bouquet);

        saveFlowerLinks(saved, dto.getFlowers());

        return mapToDTO(saved);
    }

    // ================= UPDATE =================
    @Transactional
    public BouquetDTO updateBouquet(Integer id, BouquetDTO dto) {

        Bouquet bouquet = bouquetRepository.findById(id).orElse(null);

        if (bouquet == null) return null;

        if (dto.getFlowers() == null) {
            dto.setFlowers(new ArrayList<>());
        }

        copyDtoToEntity(dto, bouquet);

        Bouquet updated = bouquetRepository.save(bouquet);

        bouquetFlowerRepository.deleteByBouquetId(id);
        saveFlowerLinks(updated, dto.getFlowers());

        return mapToDTO(updated);
    }

    // ================= SAFE COPY =================
    private void copyDtoToEntity(BouquetDTO dto, Bouquet bouquet) {

        bouquet.setEmertimi(dto.getEmertimi());
        bouquet.setPershkrimi(dto.getPershkrimi());
        bouquet.setMadhesia(dto.getMadhesia());
        bouquet.setFoto(dto.getFoto());
        bouquet.setEshteAktiv(dto.getEshteAktiv());

        double totalPrice = 0.0;

        if (dto.getFlowers() != null) {
            for (BouquetFlowerRequestDTO item : dto.getFlowers()) {

                if (item == null || item.getFlowerId() == null) continue;

                Flower flower = flowerRepository.findById(item.getFlowerId()).orElse(null);

                if (flower != null && flower.getCmimi() != null && item.getSasia() != null) {
                    totalPrice += flower.getCmimi() * item.getSasia();
                }
            }
        }

        bouquet.setCmimi(totalPrice);
    }

    // ================= SAFE RELATIONS =================
    private void saveFlowerLinks(Bouquet bouquet,
                                 List<BouquetFlowerRequestDTO> flowers) {

        if (flowers == null) return;

        for (BouquetFlowerRequestDTO item : flowers) {

            if (item == null || item.getFlowerId() == null) continue;

            Flower flower = flowerRepository.findById(item.getFlowerId()).orElse(null);

            if (flower == null) continue;

            BouquetFlower bf = new BouquetFlower();
            bf.setBouquet(bouquet);
            bf.setFlower(flower);
            bf.setSasia(item.getSasia() != null ? item.getSasia() : 1);

            bouquetFlowerRepository.save(bf);
        }
    }

    // ================= DELETE =================
    public void deleteBouquet(Integer id) {

        if (!bouquetRepository.existsById(id)) return;

        bouquetFlowerRepository.deleteByBouquetId(id);
        bouquetRepository.deleteById(id);
    }
}