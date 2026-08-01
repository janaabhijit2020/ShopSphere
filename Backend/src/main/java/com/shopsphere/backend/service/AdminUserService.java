package com.shopsphere.backend.service;

import com.shopsphere.backend.dto.admin.AdminUserResponse;

import java.util.List;

public interface AdminUserService {

    List<AdminUserResponse> getAllCustomers();

    long getCustomerCount();
}