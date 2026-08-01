import axiosInstance from "./axiosInstance";

export const getCart = () => {
  return axiosInstance.get("/cart");
};

export const addToCart = (productId, quantity = 1) => {
  return axiosInstance.post("/cart/add", {
    productId,
    quantity,
  });
};

export const updateCartQuantity = (cartItemId, quantity) => {
  return axiosInstance.put(`/cart/item/${cartItemId}`, {
    quantity,
  });
};

export const removeCartItem = (cartItemId) => {
  return axiosInstance.delete(`/cart/item/${cartItemId}`);
};

export const clearCart = () => {
  return axiosInstance.delete("/cart/clear");
};