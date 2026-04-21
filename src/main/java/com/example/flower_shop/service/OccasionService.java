package com.example.flower_shop.service;

import com.example.flower_shop.dto.OccasionDTO;
import com.example.flower_shop.model.Occasion;
import com.example.flower_shop.repository.OccasionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OccasionService {

    private final OccasionRepository occasionRepository;

    public OccasionService(OccasionRepository occasionRepository) {
        this.occasionRepository = occasionRepository;
    }

    private OccasionDTO mapToDTO(Occasion occasion) {
        OccasionDTO dto = new OccasionDTO();
        dto.setId(occasion.getId());
        dto.setEmertimi(occasion.getEmertimi());
        dto.setPershkrimi(occasion.getPershkrimi());
        dto.setDataNgjarjes(occasion.getDataNgjarjes());
        dto.setZbritjaPerqindje(occasion.getZbritjaPerqindje());
        return dto;
    }

    public List<OccasionDTO> getAllOccasions() {
        return occasionRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public OccasionDTO getOccasionById(Integer id) {
        return occasionRepository.findById(id)
                .map(this::mapToDTO)
                .orElse(null);
    }

    public OccasionDTO addOccasion(OccasionDTO dto) {
        Occasion occasion = new Occasion();

        occasion.setEmertimi(dto.getEmertimi());
        occasion.setPershkrimi(dto.getPershkrimi());
        occasion.setDataNgjarjes(dto.getDataNgjarjes());
        occasion.setZbritjaPerqindje(dto.getZbritjaPerqindje());

        Occasion savedOccasion = occasionRepository.save(occasion);
        
        dto.setId(savedOccasion.getId());
        return dto;
    }

    public void deleteOccasion(Integer id) {
        if (occasionRepository.existsById(id)) {
            occasionRepository.deleteById(id);
        }
    }

    public OccasionDTO updateOccasion(Integer id, OccasionDTO dto) {
        Occasion occasion = occasionRepository.findById(id).orElse(null);
        if (occasion != null) {
            
            occasion.setEmertimi(dto.getEmertimi());
            occasion.setPershkrimi(dto.getPershkrimi());
            occasion.setDataNgjarjes(dto.getDataNgjarjes());
            occasion.setZbritjaPerqindje(dto.getZbritjaPerqindje());

            Occasion updatedOccasion = occasionRepository.save(occasion);
            return mapToDTO(updatedOccasion);
        }
        return null;
    }
}