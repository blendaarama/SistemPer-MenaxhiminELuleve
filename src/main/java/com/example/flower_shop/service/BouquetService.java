package com.example.flower_shop.service;

import com.example.flower_shop.dto.BouquetDTO;
import com.example.flower_shop.model.Bouquet;
import com.example.flower_shop.repository.BouquetRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BouquetService {

    private final BouquetRepository bouquetRepository;

    public BouquetService(BouquetRepository bouquetRepository) {
        this.bouquetRepository = bouquetRepository;
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

    public BouquetDTO addBouquet(BouquetDTO dto) {
        Bouquet bouquet = new Bouquet();

        bouquet.setEmertimi(dto.getEmertimi());
        bouquet.setPershkrimi(dto.getPershkrimi());
        bouquet.setCmimi(dto.getCmimi());
        bouquet.setMadhesia(dto.getMadhesia());
        bouquet.setFoto(dto.getFoto());
        bouquet.setEshteAktiv(dto.getEshteAktiv());

        Bouquet savedBouquet = bouquetRepository.save(bouquet);
        dto.setId(savedBouquet.getId());
        return dto;
    }

    public void deleteBouquet(Integer id) {
        if (bouquetRepository.existsById(id)) {
            bouquetRepository.deleteById(id);
        }
    }

    public BouquetDTO updateBouquet(Integer id, BouquetDTO dto) {
        Bouquet bouquet = bouquetRepository.findById(id).orElse(null);
        if (bouquet != null) {
            bouquet.setEmertimi(dto.getEmertimi());
            bouquet.setPershkrimi(dto.getPershkrimi());
            bouquet.setCmimi(dto.getCmimi());
            bouquet.setMadhesia(dto.getMadhesia());
            bouquet.setFoto(dto.getFoto());
            bouquet.setEshteAktiv(dto.getEshteAktiv());

            Bouquet updated = bouquetRepository.save(bouquet);
            return mapToDTO(updated);
        }
        return null;
    }
}