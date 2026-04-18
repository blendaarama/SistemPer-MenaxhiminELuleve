package com.example.flower_shop.controller;

import com.example.flower_shop.model.Customer;
import com.example.flower_shop.repository.CustomerRepository;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerController {
   
    private final CustomerRepository customerRepository;

    CustomerController(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @GetMapping
    public List<Customer> getAllCustomers(){
        return customerRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Customer addCustomer(@RequestBody Customer customer){
        return customerRepository.save(customer);
    }

    @GetMapping("/{id}")
    public Customer getCustomerById(@PathVariable Long id){
        return customerRepository.findById(id).orElse(null);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCustomer(@PathVariable Long id){
        if(customerRepository.existsById(id)){
            customerRepository.deleteById(id);
        }
    }

    @PutMapping("/{id}")
    public Customer updateCustomer(@PathVariable Long id, @RequestBody Customer customerDetails) {
        Customer customer = customerRepository.findById(id).orElse(null);
        if (customer != null) {
            customer.setEmri(customerDetails.getEmri());
            customer.setMbiemri(customerDetails.getMbiemri());
            customer.setEmail(customerDetails.getEmail());
            customer.setTelefoni(customerDetails.getTelefoni());
            customer.setAdresa(customerDetails.getAdresa());
    
            return customerRepository.save(customer);
        }
        return null;
    }
}
