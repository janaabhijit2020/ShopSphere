import axiosInstance from "./axiosInstance";

export const getMyProfile = () => {
  return axiosInstance.get("/profile");
};

export const updateProfile = (profileData) => {
  return axiosInstance.put(
    "/profile",
    profileData
  );
};

export const changePassword = (
  oldPassword,
  newPassword
) => {
  return axiosInstance.put(
    "/profile/change-password",
    {
      oldPassword,
      newPassword,
    }
  );
};