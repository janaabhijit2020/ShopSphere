import axiosInstance from "../api/axios";

export const getReviewsByProduct = (productId) => {
  return axiosInstance.get(
    `/reviews/product/${productId}`
  );
};

export const addReview = (reviewData) => {
  return axiosInstance.post(
    "/reviews",
    reviewData
  );
};

export const updateReview = (
  reviewId,
  reviewData
) => {
  return axiosInstance.put(
    `/reviews/${reviewId}`,
    reviewData
  );
};

export const deleteReview = (reviewId) => {
  return axiosInstance.delete(
    `/reviews/${reviewId}`
  );
};