package com.example.flower_shop.service;

import com.example.flower_shop.model.Payment;
import com.example.flower_shop.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public List<Payment> getAll() {
        return paymentRepository.findAll();
    }

    public Payment create(Payment payment) {
        return paymentRepository.save(payment);
    }

    public Payment update(Integer id, Payment updated) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow();

        payment.setAmount(updated.getAmount());
        payment.setPaymentMethod(updated.getPaymentMethod());
        payment.setStatus(updated.getStatus());
      payment.setPorosia(updated.getPorosia());

        return paymentRepository.save(payment);
    }

    public void delete(Integer id) {
        paymentRepository.deleteById(id);
    }
}