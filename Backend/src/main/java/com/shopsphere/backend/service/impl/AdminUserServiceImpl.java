package com.shopsphere.backend.service.impl;

import com.shopsphere.backend.dto.admin.AdminUserResponse;
import com.shopsphere.backend.entity.Role;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.repository.UserRepository;
import com.shopsphere.backend.service.AdminUserService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminUserServiceImpl
        implements AdminUserService {

    private final UserRepository
            userRepository;


    public AdminUserServiceImpl(
            UserRepository userRepository
    ) {

        this.userRepository =
                userRepository;
    }


    // ==========================================
    // GET ALL CUSTOMERS
    // ==========================================

    @Override
    public List<AdminUserResponse>
    getAllCustomers() {

        return userRepository

                .findByRole(
                        Role.CUSTOMER
                )

                .stream()

                .map(
                        this::mapToResponse
                )

                .toList();
    }


    // ==========================================
    // GET TOTAL CUSTOMER COUNT
    // ==========================================

    @Override
    public long getCustomerCount() {

        return userRepository

                .countByRole(
                        Role.CUSTOMER
                );
    }


    // ==========================================
    // USER TO DTO MAPPER
    // ==========================================

    private AdminUserResponse
    mapToResponse(
            User user
    ) {

        return new AdminUserResponse(

                user.getId(),

                user.getFirstName(),

                user.getLastName(),

                user.getEmail(),

                user.getRole()
                        .name()
        );
    }
}