package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.profile.ChangePasswordRequest;
import com.shopsphere.backend.dto.profile.UpdateProfileRequest;
import com.shopsphere.backend.dto.profile.UserProfileResponse;
import com.shopsphere.backend.service.UserProfileService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @GetMapping
    public UserProfileResponse getMyProfile() {
        return userProfileService.getMyProfile();
    }

    @PutMapping
    public UserProfileResponse updateProfile(
            @Valid @RequestBody UpdateProfileRequest request) {

        return userProfileService.updateProfile(request);
    }

    @PutMapping("/change-password")
    public String changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {

        userProfileService.changePassword(request);

        return "Password changed successfully";
    }
}