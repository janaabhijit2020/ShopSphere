package com.shopsphere.backend.service.impl;

import com.shopsphere.backend.entity.Order;
import com.shopsphere.backend.entity.Payment;
import java.time.LocalDateTime;
import com.shopsphere.backend.dto.payment.PaymentRequest;
import com.shopsphere.backend.dto.payment.PaymentResponse;
import com.shopsphere.backend.repository.OrderRepository;
import com.shopsphere.backend.repository.PaymentRepository;
import com.shopsphere.backend.service.PaymentService;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public PaymentServiceImpl(PaymentRepository paymentRepository,
                              OrderRepository orderRepository) {

        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public PaymentResponse makePayment(PaymentRequest request) {

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (paymentRepository.findByOrderId(order.getId()).isPresent()) {
            throw new RuntimeException("Payment already exists for this order");
        }

        Payment payment = new Payment();

        payment.setOrder(order);
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setAmount(order.getTotalAmount());
        payment.setPaymentDate(LocalDateTime.now());

        if ("COD".equalsIgnoreCase(request.getPaymentMethod())) {
            payment.setPaymentStatus("PENDING");
        } else {
            payment.setPaymentStatus("SUCCESS");
        }

        Payment saved = paymentRepository.save(payment);

        return new PaymentResponse(
                saved.getId(),
                saved.getOrder().getId(),
                saved.getPaymentMethod(),
                saved.getPaymentStatus(),
                saved.getAmount(),
                saved.getPaymentDate()
        );
    }

    @Override
    public PaymentResponse getPaymentByOrder(Long orderId) {

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        return new PaymentResponse(
                payment.getId(),
                payment.getOrder().getId(),
                payment.getPaymentMethod(),
                payment.getPaymentStatus(),
                payment.getAmount(),
                payment.getPaymentDate()
        );
    }
}