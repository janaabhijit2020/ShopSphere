package com.shopsphere.backend.service;

import com.shopsphere.backend.dto.order.OrderResponse;
import com.shopsphere.backend.dto.order.PlaceOrderRequest;

import java.util.List;

public interface OrderService {

    // Customer features

    OrderResponse placeOrder(
            PlaceOrderRequest request
    );

    List<OrderResponse> getMyOrders();

    OrderResponse getOrderById(
            Long orderId
    );

    void cancelOrder(
            Long orderId
    );


    // Admin features

    List<OrderResponse> getAllOrders();

    OrderResponse getOrderByIdForAdmin(
            Long orderId
    );

    OrderResponse updateOrderStatus(
            Long orderId,
            String status
    );
}