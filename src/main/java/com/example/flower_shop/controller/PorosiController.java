package com.example.flower_shop.controller;

import com.example.flower_shop.model.Porosi;
import com.example.flower_shop.repository.PorosiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/porosi")
public class PorosiController {

    @Autowired private PorosiRepository repository;

    @GetMapping 
    public List<Porosi> getAll(){
        return repository.findAll();
    }
}
