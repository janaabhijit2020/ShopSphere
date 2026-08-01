import axiosInstance from "../api/axios";

export const getAllCategories = () => {
  return axiosInstance.get(
    "/categories"
  );
};

export const createCategory = (
  categoryData
) => {
  return axiosInstance.post(
    "/categories",
    categoryData
  );
};

export const updateCategory = (
  categoryId,
  categoryData
) => {
  return axiosInstance.put(
    `/categories/${categoryId}`,
    categoryData
  );
};

export const deleteCategory = (
  categoryId
) => {
  return axiosInstance.delete(
    `/categories/${categoryId}`
  );
};