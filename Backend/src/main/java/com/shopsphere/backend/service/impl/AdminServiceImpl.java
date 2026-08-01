package com.shopsphere.backend.service.impl;

import com.shopsphere.backend.dto.admin.AdminDashboardResponse;
import com.shopsphere.backend.repository.OrderRepository;
import com.shopsphere.backend.repository.ProductRepository;
import com.shopsphere.backend.repository.UserRepository;
import com.shopsphere.backend.service.AdminService;
import org.springframework.stereotype.Service;

@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public AdminServiceImpl(UserRepository userRepository,
                            ProductRepository productRepository,
                            OrderRepository orderRepository) {

        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public AdminDashboardResponse getDashboard() {

        Long totalUsers = userRepository.count();

        Long totalProducts = productRepository.count();

        Long totalOrders = orderRepository.count();

        return new AdminDashboardResponse(
                totalUsers,
                totalProducts,
                totalOrders,
                orderRepository.getTotalRevenue()
        );
    }
}