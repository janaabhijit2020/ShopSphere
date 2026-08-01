import axiosInstance from "./axiosInstance";

export const getMyWishlist = () => {
  return axiosInstance.get("/wishlist");
};

export const addToWishlist = (productId) => {
  return axiosInstance.post(
    `/wishlist/${productId}`
  );
};

export const removeFromWishlist = (productId) => {
  return axiosInstance.delete(
    `/wishlist/${productId}`
  );
};