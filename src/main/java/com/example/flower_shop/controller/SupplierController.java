package com.example.flower_shop.controller;

import com.example.flower_shop.model.Supplier;
import com.example.flower_shop.repository.SupplierRepository;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "http://localhost:3000")
public class SupplierController {

    private final SupplierRepository supplierRepository;

    SupplierController(SupplierRepository supplierRepository){
        this.supplierRepository = supplierRepository;
    }

    @GetMapping
    public List<Supplier> getAllSuppliers(){
        return supplierRepository.findAll();
    }
    
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Supplier addSupplier(@RequestBody Supplier supplier){
        return supplierRepository.save(supplier);
    }
    
    @GetMapping("/{id}")
    public Supplier getSupplierById(@PathVariable Long id){
        return supplierRepository.findById(id).orElse(null);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSupplier(@PathVariable Long id){
        if(supplierRepository.existsById(id)) {
            supplierRepository.deleteById(id);
    }
    }

    @PutMapping("/{id}")
    public Supplier updateSupplier(@PathVariable Long id,@RequestBody Supplier supplierDetails){
        Supplier supplier= supplierRepository.findById(id).orElse(null);
        if(supplier != null){
            supplier.setEmertimi(supplierDetails.getEmertimi());
            supplier.setKontakti(supplierDetails.getKontakti());
            supplier.setEmail(supplierDetails.getEmail());
            supplier.setTelefoni(supplierDetails.getTelefoni());
            supplier.setAdresa(supplierDetails.getAdresa());

            return supplierRepository.save(supplier);
        }
        return null;
    }
}
