import axiosInstance from "./axiosInstance";

export const placeOrder = (addressId) => {
  return axiosInstance.post(
    "/orders/place",
    {
      addressId: addressId,
    }
  );
};

export const getMyOrders = () => {
  return axiosInstance.get("/orders");
};

export const getOrderById = (orderId) => {
  return axiosInstance.get(
    `/orders/${orderId}`
  );
};

export const cancelOrder = (orderId) => {
  return axiosInstance.put(
    `/orders/${orderId}/cancel`
  );
};