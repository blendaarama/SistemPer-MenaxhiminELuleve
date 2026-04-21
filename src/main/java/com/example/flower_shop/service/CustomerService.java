package com.example.flower_shop.service;

import java.time.LocalDate;
import java.util.List;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.flower_shop.model.Customer;
import com.example.flower_shop.repository.CustomerRepository;

@Service
public class CustomerService {
    

    @Autowired
    private CustomerRepository repository;

    public List<Customer> getAll(){
        return repository.findAll();
    }
    public Customer getById(Integer id){
        return repository.findById(id).orElse(null);
    }

    public Customer create(Customer customer){
          if (repository.existsByEmail(customer.getEmail())) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Email already exists"
        );
    }
         customer.setDataRegjistrimit(LocalDate.now());
        return repository.save(customer);
    }
    public Customer update(Integer id, Customer update){
        Customer existing=getById(id);
        existing.setAdresa(update.getAdresa());
        existing.setEmail(update.getEmail());
        existing.setTelefoni(update.getTelefoni());
        existing.setEmri(update.getEmri());
        existing.setMbiemri(update.getMbiemri());

        return repository.save(existing);

}
    public boolean delete(Integer id){
       Customer existing=getById(id);
       if(existing == null )return false;
       repository.delete(existing);
       return true;
    }
}
