import axiosInstance from "./axiosInstance";

export const getAddresses = () => {
  return axiosInstance.get("/address");
};

export const addAddress = (addressData) => {
  return axiosInstance.post(
    "/address",
    addressData
  );
};

export const updateAddress = (
  addressId,
  addressData
) => {
  return axiosInstance.put(
    `/address/${addressId}`,
    addressData
  );
};

export const deleteAddress = (
  addressId
) => {
  return axiosInstance.delete(
    `/address/${addressId}`
  );
};