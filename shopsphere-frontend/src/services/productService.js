import axiosInstance from "../api/axios";

// Get all products
export const getAllProducts = () => {
  return axiosInstance.get("/products");
};

// Get one product by ID
export const getProductById = (id) => {
  return axiosInstance.get(
    `/products/${id}`
  );
};

// Search products
export const searchProducts = (
  keyword
) => {
  return axiosInstance.get(
    "/products/search",
    {
      params: {
        keyword,
      },
    }
  );
};

// Get products by category
export const getProductsByCategory = (
  categoryId
) => {
  return axiosInstance.get(
    `/products/category/${categoryId}`
  );
};

// Filter products by price
export const filterProductsByPrice = (
  minPrice,
  maxPrice
) => {
  return axiosInstance.get(
    "/products/filter",
    {
      params: {
        minPrice,
        maxPrice,
      },
    }
  );
};

// Sort products by price:
// Low to high
export const sortProductsByPriceAsc =
  () => {
    return axiosInstance.get(
      "/products/sort/price-asc"
    );
  };

// Sort products by price:
// High to low
export const sortProductsByPriceDesc =
  () => {
    return axiosInstance.get(
      "/products/sort/price-desc"
    );
  };

// Get latest products
export const getLatestProducts = () => {
  return axiosInstance.get(
    "/products/latest"
  );
};

// Combined search, filter,
// and sorting API
export const filterProducts = ({
  keyword,
  categoryId,
  minPrice,
  maxPrice,
  sort,
}) => {
  const params = {};

  if (keyword?.trim()) {
    params.keyword =
      keyword.trim();
  }

  if (
    categoryId !== "" &&
    categoryId !== null &&
    categoryId !== undefined
  ) {
    params.categoryId =
      categoryId;
  }

  if (
    minPrice !== "" &&
    minPrice !== null &&
    minPrice !== undefined
  ) {
    params.minPrice =
      minPrice;
  }

  if (
    maxPrice !== "" &&
    maxPrice !== null &&
    maxPrice !== undefined
  ) {
    params.maxPrice =
      maxPrice;
  }

  if (sort) {
    params.sort = sort;
  }

  return axiosInstance.get(
    "/products/filter-products",
    {
      params,
    }
  );
};

// ==========================================
// ADMIN: ADD PRODUCT STOCK
// ==========================================

export const addProductStock = (
  productId,
  quantity
) => {
  return axiosInstance.put(
    `/products/${productId}/stock`,
    null,
    {
      params: {
        quantity,
      },
    }
  );
};