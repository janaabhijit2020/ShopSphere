package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.payment.PaymentRequest;
import com.shopsphere.backend.dto.payment.PaymentResponse;
import com.shopsphere.backend.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public PaymentResponse makePayment(@Valid @RequestBody PaymentRequest request) {
        return paymentService.makePayment(request);
    }

    @GetMapping("/{orderId}")
    public PaymentResponse getPaymentByOrder(@PathVariable Long orderId) {
        return paymentService.getPaymentByOrder(orderId);
    }
}