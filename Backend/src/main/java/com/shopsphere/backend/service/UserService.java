package com.shopsphere.backend.service;

import com.shopsphere.backend.dto.auth.LoginRequest;
import com.shopsphere.backend.dto.auth.LoginResponse;
import com.shopsphere.backend.entity.User;

public interface UserService {

    User registerUser(User user);

    LoginResponse loginUser(LoginRequest request);

}