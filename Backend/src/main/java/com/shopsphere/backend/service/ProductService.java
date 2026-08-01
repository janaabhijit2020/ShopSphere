package com.shopsphere.backend.service;

import com.shopsphere.backend.dto.product.ProductRequest;
import com.shopsphere.backend.dto.product.ProductResponse;

import java.math.BigDecimal;
import java.util.List;

public interface ProductService {

    // ==================================================
    // CREATE
    // ==================================================

    ProductResponse createProduct(
            ProductRequest request
    );

    // ==================================================
    // READ
    // ==================================================

    List<ProductResponse> getAllProducts();

    ProductResponse getProductById(
            Long id
    );

    // ==================================================
    // PAGINATION
    // ==================================================

    List<ProductResponse> getProductsWithPagination(
            int page,
            int size
    );

    // ==================================================
    // UPDATE
    // ==================================================

    ProductResponse updateProduct(
            Long id,
            ProductRequest request
    );

    // ==================================================
    // ADD STOCK
    // ==================================================

    ProductResponse addStock(
            Long id,
            Integer quantity
    );

    // ==================================================
    // DELETE
    // ==================================================

    void deleteProduct(
            Long id
    );

    // ==================================================
    // SEARCH
    // ==================================================

    List<ProductResponse> searchProducts(
            String keyword
    );

    // ==================================================
    // CATEGORY FILTER
    // ==================================================

    List<ProductResponse> getProductsByCategory(
            Long categoryId
    );

    // ==================================================
    // PRICE FILTER
    // ==================================================

    List<ProductResponse> filterByPrice(
            BigDecimal minPrice,
            BigDecimal maxPrice
    );

    // ==================================================
    // SORTING
    // ==================================================

    List<ProductResponse> sortByPriceAsc();

    List<ProductResponse> sortByPriceDesc();

    List<ProductResponse> getLatestProducts();

    // ==================================================
    // COMBINED SEARCH, FILTER AND SORT
    // ==================================================

    List<ProductResponse> filterProducts(
            String keyword,
            Long categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String sort
    );
}