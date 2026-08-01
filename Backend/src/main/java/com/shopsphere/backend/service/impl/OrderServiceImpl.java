package com.shopsphere.backend.service.impl;

import com.shopsphere.backend.dto.order.OrderItemResponse;
import com.shopsphere.backend.dto.order.OrderResponse;
import com.shopsphere.backend.dto.order.PlaceOrderRequest;

import com.shopsphere.backend.entity.Address;
import com.shopsphere.backend.entity.Cart;
import com.shopsphere.backend.entity.CartItem;
import com.shopsphere.backend.entity.Order;
import com.shopsphere.backend.entity.OrderItem;
import com.shopsphere.backend.entity.Product;
import com.shopsphere.backend.entity.User;

import com.shopsphere.backend.repository.AddressRepository;
import com.shopsphere.backend.repository.CartRepository;
import com.shopsphere.backend.repository.OrderRepository;
import com.shopsphere.backend.repository.ProductRepository;

import com.shopsphere.backend.service.CurrentUserService;
import com.shopsphere.backend.service.OrderService;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
public class OrderServiceImpl
        implements OrderService {

    private final OrderRepository orderRepository;

    private final CartRepository cartRepository;

    private final AddressRepository addressRepository;

    private final ProductRepository productRepository;

    private final CurrentUserService currentUserService;

    public OrderServiceImpl(

            OrderRepository orderRepository,

            CartRepository cartRepository,

            AddressRepository addressRepository,

            ProductRepository productRepository,

            CurrentUserService currentUserService
    ) {

        this.orderRepository =
                orderRepository;

        this.cartRepository =
                cartRepository;

        this.addressRepository =
                addressRepository;

        this.productRepository =
                productRepository;

        this.currentUserService =
                currentUserService;
    }

    // ==================================================
    // CUSTOMER: PLACE ORDER
    // ==================================================

    @Override
    @Transactional
    public OrderResponse placeOrder(

            PlaceOrderRequest request
    ) {

        User user =

                currentUserService
                        .getCurrentUser();

        Cart cart =

                cartRepository
                        .findByUserId(
                                user.getId()
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(

                                                "Cart not found"
                                        )
                        );

        if (
                cart.getCartItems()
                        .isEmpty()
        ) {

            throw new RuntimeException(

                    "Cart is empty"
            );
        }

        Address address =

                addressRepository
                        .findById(

                                request
                                        .getAddressId()
                        )

                        .orElseThrow(
                                () ->
                                        new RuntimeException(

                                                "Address not found"
                                        )
                        );

        if (
                !address.getUser()
                        .getId()

                        .equals(
                                user.getId()
                        )
        ) {

            throw new RuntimeException(

                    "Invalid address"
            );
        }

        // Check stock before creating order

        for (
                CartItem cartItem :
                cart.getCartItems()
        ) {

            Product product =

                    productRepository
                            .findById(

                                    cartItem
                                            .getProduct()
                                            .getId()
                            )

                            .orElseThrow(
                                    () ->
                                            new RuntimeException(

                                                    "Product not found"
                                            )
                            );

            if (
                    product.getStock()

                            <

                            cartItem
                                    .getQuantity()
            ) {

                throw new RuntimeException(

                        "Only "

                                + product.getStock()

                                + " item(s) of "

                                + product.getName()

                                + " are available"
                );
            }
        }

        Order order =
                new Order();

        order.setUser(
                user
        );

        order.setAddress(
                address
        );

        order.setOrderDate(

                LocalDateTime.now()
        );

        order.setStatus(
                "PLACED"
        );

        BigDecimal totalAmount =

                BigDecimal.ZERO;

        // Create order items and reduce stock

        for (
                CartItem cartItem :
                cart.getCartItems()
        ) {

            Product product =

                    productRepository
                            .findById(

                                    cartItem
                                            .getProduct()
                                            .getId()
                            )

                            .orElseThrow(
                                    () ->
                                            new RuntimeException(

                                                    "Product not found"
                                            )
                            );

            OrderItem orderItem =

                    new OrderItem();

            orderItem.setOrder(
                    order
            );

            orderItem.setProduct(
                    product
            );

            orderItem.setQuantity(

                    cartItem
                            .getQuantity()
            );

            orderItem.setPrice(

                    cartItem
                            .getPrice()
            );

            order.getOrderItems()
                    .add(
                            orderItem
                    );

            totalAmount =

                    totalAmount.add(

                            cartItem
                                    .getPrice()

                                    .multiply(

                                            BigDecimal
                                                    .valueOf(

                                                            cartItem
                                                                    .getQuantity()
                                                    )
                                    )
                    );

            product.setStock(

                    product.getStock()

                            -

                            cartItem
                                    .getQuantity()
            );

            productRepository
                    .save(
                            product
                    );
        }

        order.setTotalAmount(

                totalAmount
        );

        Order savedOrder =

                orderRepository
                        .save(
                                order
                        );

        // Clear cart after successful order

        cart.getCartItems()
                .clear();

        cartRepository
                .save(
                        cart
                );

        return mapToResponse(

                savedOrder
        );
    }


    // ==================================================
    // CUSTOMER: GET MY ORDERS
    // ==================================================

    @Override
    public List<OrderResponse>
    getMyOrders() {

        User user =

                currentUserService
                        .getCurrentUser();

        return orderRepository

                .findByUserIdOrderByOrderDateDesc(

                        user.getId()
                )

                .stream()

                .map(
                        this::mapToResponse
                )

                .toList();
    }


    // ==================================================
    // CUSTOMER: GET ORDER BY ID
    // ==================================================

    @Override
    public OrderResponse
    getOrderById(

            Long orderId
    ) {

        User user =

                currentUserService
                        .getCurrentUser();

        Order order =

                orderRepository
                        .findById(

                                orderId
                        )

                        .orElseThrow(
                                () ->
                                        new RuntimeException(

                                                "Order not found"
                                        )
                        );

        if (
                !order.getUser()
                        .getId()

                        .equals(
                                user.getId()
                        )
        ) {

            throw new RuntimeException(

                    "You cannot access "
                            +
                            "another user's order"
            );
        }

        return mapToResponse(
                order
        );
    }


    // ==================================================
    // CUSTOMER: CANCEL ORDER
    // ==================================================

    @Override
    @Transactional
    public void cancelOrder(

            Long orderId
    ) {

        User user =

                currentUserService
                        .getCurrentUser();

        Order order =

                orderRepository
                        .findById(

                                orderId
                        )

                        .orElseThrow(
                                () ->
                                        new RuntimeException(

                                                "Order not found"
                                        )
                        );

        if (
                !order.getUser()
                        .getId()

                        .equals(
                                user.getId()
                        )
        ) {

            throw new RuntimeException(

                    "You cannot cancel "
                            +
                            "another user's order"
            );
        }

        if (
                "CANCELLED"
                        .equals(

                                order
                                        .getStatus()
                        )
        ) {

            throw new RuntimeException(

                    "This order has already "
                            +
                            "been cancelled"
            );
        }

        for (
                OrderItem orderItem :
                order.getOrderItems()
        ) {

            Product product =

                    productRepository
                            .findById(

                                    orderItem
                                            .getProduct()
                                            .getId()
                            )

                            .orElseThrow(
                                    () ->
                                            new RuntimeException(

                                                    "Product not found"
                                            )
                            );

            product.setStock(

                    product.getStock()

                            +

                            orderItem
                                    .getQuantity()
            );

            productRepository
                    .save(
                            product
                    );
        }

        order.setStatus(
                "CANCELLED"
        );

        orderRepository
                .save(
                        order
                );
    }


    // ==================================================
    // ADMIN: GET ALL ORDERS
    // ==================================================

    @Override
    public List<OrderResponse>
    getAllOrders() {

        return orderRepository

                .findAllByOrderByOrderDateDesc()

                .stream()

                .map(
                        this::mapToResponse
                )

                .toList();
    }


    // ==================================================
    // ADMIN: GET ANY ORDER BY ID
    // ==================================================

    @Override
    public OrderResponse
    getOrderByIdForAdmin(

            Long orderId
    ) {

        Order order =

                orderRepository
                        .findById(

                                orderId
                        )

                        .orElseThrow(
                                () ->
                                        new RuntimeException(

                                                "Order not found"
                                        )
                        );

        return mapToResponse(
                order
        );
    }


    // ==================================================
    // ADMIN: UPDATE ORDER STATUS
    // ==================================================

    @Override
    @Transactional
    public OrderResponse
    updateOrderStatus(

            Long orderId,

            String status
    ) {

        Order order =

                orderRepository
                        .findById(

                                orderId
                        )

                        .orElseThrow(
                                () ->
                                        new RuntimeException(

                                                "Order not found"
                                        )
                        );

        String updatedStatus =

                status
                        .trim()
                        .toUpperCase();

        Set<String> validStatuses =

                Set.of(

                        "PLACED",

                        "PROCESSING",

                        "SHIPPED",

                        "DELIVERED",

                        "CANCELLED"
                );

        if (
                !validStatuses.contains(

                        updatedStatus
                )
        ) {

            throw new RuntimeException(

                    "Invalid order status. "

                            +

                            "Allowed values are: "

                            +

                            "PLACED, PROCESSING, "

                            +

                            "SHIPPED, DELIVERED, "

                            +

                            "CANCELLED"
            );
        }

        /*
         * Prevent an admin from changing
         * a cancelled order.
         *
         * The customer cancellation process
         * restores product stock.
         */
        if (
                "CANCELLED"
                        .equals(

                                order
                                        .getStatus()
                        )
        ) {

            throw new RuntimeException(

                    "Cancelled orders cannot "
                            +
                            "be updated"
            );
        }

        /*
         * Delivered orders are final.
         */
        if (
                "DELIVERED"
                        .equals(

                                order
                                        .getStatus()
                        )
        ) {

            throw new RuntimeException(

                    "Delivered orders cannot "
                            +
                            "be updated"
            );
        }

        order.setStatus(

                updatedStatus
        );

        Order updatedOrder =

                orderRepository
                        .save(
                                order
                        );

        return mapToResponse(

                updatedOrder
        );
    }


    // ==================================================
    // MAP ORDER TO RESPONSE
    // ==================================================

    private OrderResponse
    mapToResponse(

            Order order
    ) {

        List<OrderItemResponse>
                itemResponses =

                order.getOrderItems()

                        .stream()

                        .map(
                                item ->

                                        new OrderItemResponse(

                                                item
                                                        .getProduct()
                                                        .getId(),

                                                item
                                                        .getProduct()
                                                        .getName(),

                                                item
                                                        .getQuantity(),

                                                item
                                                        .getPrice(),

                                                item
                                                        .getPrice()

                                                        .multiply(

                                                                BigDecimal
                                                                        .valueOf(

                                                                                item
                                                                                        .getQuantity()
                                                                        )
                                                        )
                                        )
                        )

                        .toList();

        String addressLine2 =

                order.getAddress()
                        .getAddressLine2();

        String deliveryAddress =

                order.getAddress()
                        .getAddressLine1()

                        +

                        (
                                addressLine2 != null

                                        &&

                                        !addressLine2
                                                .isBlank()

                                        ?

                                        ", "
                                                +
                                                addressLine2

                                        :

                                        ""
                        )

                        + ", "

                        + order.getAddress()
                        .getCity()

                        + ", "

                        + order.getAddress()
                        .getState()

                        + " - "

                        + order.getAddress()
                        .getPostalCode()

                        + ", "

                        + order.getAddress()
                        .getCountry();

        return new OrderResponse(

                order.getId(),

                order.getUser()
                        .getFirstName()

                        + " "

                        + order.getUser()
                        .getLastName(),

                deliveryAddress,

                order.getTotalAmount(),

                order.getStatus(),

                order.getOrderDate(),

                itemResponses
        );
    }
}