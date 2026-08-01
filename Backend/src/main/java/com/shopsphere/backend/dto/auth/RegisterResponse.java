package com.shopsphere.backend.dto.auth;

import com.shopsphere.backend.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RegisterResponse {

    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private Role role;

    private String message;

}