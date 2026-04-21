package com.example.flower_shop.controller;

import com.example.flower_shop.dto.OrderDetailsDTO;
import com.example.flower_shop.model.OrderDetails;
import com.example.flower_shop.service.OrderDetailsService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/order-details")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderDetailsController {

    @Autowired
private OrderDetailsService service;

    // GET ALL
    @GetMapping
public List<OrderDetails> getAll() {
    return service.getAll();
}

    // GET BY ID
    @GetMapping("/{id}")
      public ResponseEntity<OrderDetails> getById(@PathVariable Integer id) {
         OrderDetails od = service.getById(id);
              return od != null ? ResponseEntity.ok(od) : ResponseEntity.notFound().build();
}
    // CREATE
    @PostMapping
      public OrderDetails create(@RequestBody OrderDetails od) {
          return service.create(od);
}

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<OrderDetails> update(
        @PathVariable Integer id,
        @RequestBody OrderDetailsDTO dto) {

    OrderDetails updated = service.update(id, dto);

    return ResponseEntity.ok(updated);
}
    @DeleteMapping("/{id}")
       public ResponseEntity<Void> delete(@PathVariable Integer id) {
         boolean deleted = service.delete(id);
          return deleted ? ResponseEntity.noContent().build()
           : ResponseEntity.notFound().build();
}
}