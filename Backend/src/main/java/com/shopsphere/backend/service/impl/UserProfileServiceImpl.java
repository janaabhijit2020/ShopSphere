package com.shopsphere.backend.service.impl;

import com.shopsphere.backend.dto.profile.ChangePasswordRequest;
import com.shopsphere.backend.dto.profile.UpdateProfileRequest;
import com.shopsphere.backend.dto.profile.UserProfileResponse;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.repository.UserRepository;
import com.shopsphere.backend.service.CurrentUserService;
import com.shopsphere.backend.service.UserProfileService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserProfileServiceImpl implements UserProfileService {

    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;
    private final PasswordEncoder passwordEncoder;

    public UserProfileServiceImpl(UserRepository userRepository,
                                  CurrentUserService currentUserService,
                                  PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.currentUserService = currentUserService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserProfileResponse getMyProfile() {

        User user = currentUserService.getCurrentUser();

        return new UserProfileResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    @Override
    public UserProfileResponse updateProfile(UpdateProfileRequest request) {

        User user = currentUserService.getCurrentUser();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        User updatedUser = userRepository.save(user);

        return new UserProfileResponse(
                updatedUser.getId(),
                updatedUser.getFirstName(),
                updatedUser.getLastName(),
                updatedUser.getEmail(),
                updatedUser.getRole().name()
        );
    }

    @Override
    public void changePassword(ChangePasswordRequest request) {

        User user = currentUserService.getCurrentUser();

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);
    }
}