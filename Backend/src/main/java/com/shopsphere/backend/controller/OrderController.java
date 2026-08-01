package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.order.OrderResponse;
import com.shopsphere.backend.dto.order.PlaceOrderRequest;
import com.shopsphere.backend.dto.order.UpdateOrderStatusRequest;

import com.shopsphere.backend.service.OrderService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    public OrderController(
            OrderService orderService
    ) {
        this.orderService = orderService;
    }


    // ==================================================
    // CUSTOMER: PLACE ORDER
    // ==================================================

    @PostMapping("/place")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse placeOrder(

            @Valid
            @RequestBody
            PlaceOrderRequest request
    ) {

        return orderService
                .placeOrder(
                        request
                );
    }


    // ==================================================
    // CUSTOMER: GET MY ORDERS
    // ==================================================

    @GetMapping
    public List<OrderResponse>
    getMyOrders() {

        return orderService
                .getMyOrders();
    }


    // ==================================================
    // CUSTOMER: GET MY ORDER BY ID
    // ==================================================

    @GetMapping("/{orderId}")
    public OrderResponse getOrderById(

            @PathVariable
            Long orderId
    ) {

        return orderService
                .getOrderById(
                        orderId
                );
    }


    // ==================================================
    // CUSTOMER: CANCEL ORDER
    // ==================================================

    @PutMapping(
            "/{orderId}/cancel"
    )
    public String cancelOrder(

            @PathVariable
            Long orderId
    ) {

        orderService
                .cancelOrder(
                        orderId
                );

        return "Order cancelled successfully";
    }


    // ==================================================
    // ADMIN: GET ALL ORDERS
    // ==================================================

    @GetMapping("/admin/all")
    public List<OrderResponse>
    getAllOrdersForAdmin() {

        return orderService
                .getAllOrders();
    }


    // ==================================================
    // ADMIN: GET ANY ORDER BY ID
    // ==================================================

    @GetMapping(
            "/admin/{orderId}"
    )
    public OrderResponse
    getOrderByIdForAdmin(

            @PathVariable
            Long orderId
    ) {

        return orderService
                .getOrderByIdForAdmin(
                        orderId
                );
    }


    // ==================================================
    // ADMIN: UPDATE ORDER STATUS
    // ==================================================

    @PutMapping(
            "/admin/{orderId}/status"
    )
    public OrderResponse
    updateOrderStatus(

            @PathVariable
            Long orderId,

            @Valid
            @RequestBody
            UpdateOrderStatusRequest request
    ) {

        return orderService
                .updateOrderStatus(

                        orderId,

                        request.getStatus()
                );
    }
}