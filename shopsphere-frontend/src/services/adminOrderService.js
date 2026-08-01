import axiosInstance from "../api/axios";

// Get all orders for admin
export const getAllAdminOrders = () => {
  return axiosInstance.get(
    "/orders/admin/all"
  );
};

// Get one order by ID for admin
export const getAdminOrderById = (
  orderId
) => {
  return axiosInstance.get(
    `/orders/admin/${orderId}`
  );
};

// Update an order status
export const updateAdminOrderStatus = (
  orderId,
  status
) => {
  return axiosInstance.put(
    `/orders/admin/${orderId}/status`,
    {
      status: status,
    }
  );
};