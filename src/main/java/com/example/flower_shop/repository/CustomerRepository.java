package com.example.flower_shop.repository;

import com.example.flower_shop.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository; //krijimi i interfaceit te repositoryt per databaz dhe jep metoda te gatshme per CRUD
import org.springframework.stereotype.Repository; //importohet per organizim dhe konfigurim ne Spring

@Repository  //shenon klasen si shtrese per komunikim me databazen dhe mundeson menaxhimin e saj nga Spring.
public interface CustomerRepository extends JpaRepository<Customer, Integer>{

}