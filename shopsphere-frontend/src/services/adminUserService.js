import axiosInstance from "../api/axios";

export const getAllCustomers = () => {
  return axiosInstance.get(
    "/admin/users/customers"
  );
};

export const getCustomerCount = () => {
  return axiosInstance.get(
    "/admin/users/customers/count"
  );
};