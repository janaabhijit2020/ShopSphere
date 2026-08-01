package com.shopsphere.backend.service;

import com.shopsphere.backend.dto.profile.ChangePasswordRequest;
import com.shopsphere.backend.dto.profile.UpdateProfileRequest;
import com.shopsphere.backend.dto.profile.UserProfileResponse;

public interface UserProfileService {

    UserProfileResponse getMyProfile();

    UserProfileResponse updateProfile(UpdateProfileRequest request);

    void changePassword(ChangePasswordRequest request);
}