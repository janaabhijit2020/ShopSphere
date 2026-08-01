package com.shopsphere.backend.repository;

import com.shopsphere.backend.entity.Order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface OrderRepository
        extends JpaRepository<Order, Long> {

    // Customer: get only their own orders
    List<Order> findByUserIdOrderByOrderDateDesc(
            Long userId
    );

    // Admin: get all orders, newest first
    List<Order> findAllByOrderByOrderDateDesc();

    // Admin dashboard: calculate total revenue
    @Query("""
            SELECT COALESCE(
                SUM(o.totalAmount),
                0
            )
            FROM Order o
            WHERE o.status <> 'CANCELLED'
            """)
    BigDecimal getTotalRevenue();
}