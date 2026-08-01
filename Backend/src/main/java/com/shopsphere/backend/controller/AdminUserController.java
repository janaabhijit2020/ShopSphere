package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.admin.AdminUserResponse;
import com.shopsphere.backend.service.AdminUserService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "*")
public class AdminUserController {

    private final AdminUserService
            adminUserService;


    public AdminUserController(
            AdminUserService adminUserService
    ) {

        this.adminUserService =
                adminUserService;
    }


    // ==========================================
    // GET ALL CUSTOMERS
    // ==========================================

    @GetMapping("/customers")
    public List<AdminUserResponse>
    getAllCustomers() {

        return adminUserService
                .getAllCustomers();
    }


    // ==========================================
    // GET TOTAL CUSTOMER COUNT
    // ==========================================

    @GetMapping("/customers/count")
    public long getCustomerCount() {

        return adminUserService
                .getCustomerCount();
    }
}