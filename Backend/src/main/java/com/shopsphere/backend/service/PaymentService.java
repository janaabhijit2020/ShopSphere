package com.shopsphere.backend.service;

import com.shopsphere.backend.dto.payment.PaymentRequest;
import com.shopsphere.backend.dto.payment.PaymentResponse;

public interface PaymentService {

    PaymentResponse makePayment(PaymentRequest request);

    PaymentResponse getPaymentByOrder(Long orderId);
}