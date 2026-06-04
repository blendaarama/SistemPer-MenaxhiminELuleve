package com.example.flower_shop.service;

import com.example.flower_shop.dto.PorosiUpdateDTO;
import com.example.flower_shop.model.Customer;
import com.example.flower_shop.model.Porosi;
import com.example.flower_shop.repository.CustomerRepository;
import com.example.flower_shop.repository.PorosiRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PorosiService {

    private final PorosiRepository porosiRepository;
    private final CustomerRepository customerRepository;

    public PorosiService(PorosiRepository porosiRepository,
                         CustomerRepository customerRepository) {
        this.porosiRepository = porosiRepository;
        this.customerRepository = customerRepository;
    }

    public List<Porosi> getAll() {
        return porosiRepository.findAll();
    }

    public Porosi getById(Integer id) {
        return porosiRepository.findById(id).orElse(null);
    }

    @Transactional
    public Porosi create(Porosi porosi) {

        if (porosi.getDataPorosise() == null) {
            porosi.setDataPorosise(LocalDateTime.now());
        }

        if (porosi.getStatusi() == null || porosi.getStatusi().isBlank()) {
            porosi.setStatusi("PRITJE");
        }

        if (porosi.getShumeTotale() == null) {
            porosi.setShumeTotale(0.0);
        }

        if (porosi.getKlienti() != null) {
            Customer klienti = porosi.getKlienti();

            Customer savedCustomer;

            if (klienti.getId() != null) {
                savedCustomer = customerRepository.findById(klienti.getId())
                        .orElseThrow(() -> new RuntimeException("Klienti nuk ekziston me ID: " + klienti.getId()));
            } else {
                if (klienti.getEmri() == null || klienti.getEmri().isBlank()) {
                    klienti.setEmri("Guest");
                }

                if (klienti.getMbiemri() == null) {
                    klienti.setMbiemri("");
                }

                if (klienti.getEmail() == null || klienti.getEmail().isBlank()) {
                    klienti.setEmail(System.currentTimeMillis() + "@customer.com");
                }

                if (klienti.getTelefoni() == null) {
                    klienti.setTelefoni("");
                }

                if (klienti.getAdresa() == null) {
                    klienti.setAdresa(porosi.getAdresaDorezimit());
                }

                if (klienti.getIsVip() == null) {
                    klienti.setIsVip(false);
                }

                Customer existingCustomer =
        customerRepository.findByEmail(klienti.getEmail())
                .orElse(null);

        if (existingCustomer != null) {
            savedCustomer = existingCustomer;
        } else {
            savedCustomer = customerRepository.save(klienti);
        }
            }

            porosi.setKlienti(savedCustomer);
        }

        return porosiRepository.save(porosi);
    }

    @Transactional
    public Porosi update(Integer id, PorosiUpdateDTO dto) {
        Porosi existing = porosiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Porosia nuk u gjet me ID: " + id));

        if (dto.getStatusi() != null) {
            existing.setStatusi(dto.getStatusi());
        }

        if (dto.getShumeTotale() != null) {
            existing.setShumeTotale(dto.getShumeTotale());
        }

        if (dto.getAdresaDorezimit() != null) {
            existing.setAdresaDorezimit(dto.getAdresaDorezimit());
        }

        return porosiRepository.save(existing);
    }

    public boolean delete(Integer id) {
        if (!porosiRepository.existsById(id)) {
            return false;
        }

        porosiRepository.deleteById(id);
        return true;
    }
}