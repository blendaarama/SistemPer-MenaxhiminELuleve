package com.example.flower_shop.service;

import com.example.flower_shop.dto.BouquetDTO;
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

    public List<BouquetDTO> getAllBouquets() {
        return bouquetRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

   public BouquetDTO getBouquetById(Integer id) {
        return bouquetRepository.findById(id)
             .map(this::mapToDTO) 
             .orElse(null);
    }

    @Transactional
    public BouquetDTO addBouquet(BouquetDTO dto) {
        Bouquet bouquet = new Bouquet();
        copyDtoToEntity(dto, bouquet);

        Bouquet savedBouquet = bouquetRepository.save(bouquet);

        saveFlowerLinks(savedBouquet, dto.getFlowerIds());

        dto.setId(savedBouquet.getId());
        return dto;
    }

    @Transactional
    public BouquetDTO updateBouquet(Integer id, BouquetDTO dto) {
        Bouquet bouquet = bouquetRepository.findById(id).orElse(null);
        if (bouquet != null) {
            copyDtoToEntity(dto, bouquet);
            Bouquet updated = bouquetRepository.save(bouquet);

            bouquetFlowerRepository.deleteByBouquetId(id);
            saveFlowerLinks(updated, dto.getFlowerIds());

            return mapToDTO(updated);
        }
        return null;
    }

    private void copyDtoToEntity(BouquetDTO dto, Bouquet bouquet) {
        bouquet.setEmertimi(dto.getEmertimi());
        bouquet.setPershkrimi(dto.getPershkrimi());
        bouquet.setCmimi(dto.getCmimi());
        bouquet.setMadhesia(dto.getMadhesia());
        bouquet.setFoto(dto.getFoto());
        bouquet.setEshteAktiv(dto.getEshteAktiv());
    }

    private void saveFlowerLinks(Bouquet bouquet, List<Integer> flowerIds) {
        if (flowerIds != null && !flowerIds.isEmpty()) {
            for (Integer flowerId : flowerIds) {
                Flower flower = flowerRepository.findById(flowerId).orElse(null);
                if (flower != null) {
                    BouquetFlower bf = new BouquetFlower();
                    bf.setBouquet(bouquet);
                    bf.setFlower(flower);
                    bf.setSasia(1);
                    bouquetFlowerRepository.save(bf);
                }
            }
        }
    }

    public void deleteBouquet(Integer id) {
        if (bouquetRepository.existsById(id)) {
            bouquetFlowerRepository.deleteByBouquetId(id);
            bouquetRepository.deleteById(id);
        }
    }
}