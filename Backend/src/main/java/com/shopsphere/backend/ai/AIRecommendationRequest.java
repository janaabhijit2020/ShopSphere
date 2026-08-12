package com.shopsphere.backend.ai;

import java.math.BigDecimal;
import java.util.List;

public class AIRecommendationRequest {

    private String userRequest;

    private List<ProductInfo> products;

    public AIRecommendationRequest() {
    }

    public AIRecommendationRequest(
            String userRequest,
            List<ProductInfo> products
    ) {
        this.userRequest = userRequest;
        this.products = products;
    }

    public String getUserRequest() {
        return userRequest;
    }

    public void setUserRequest(
            String userRequest
    ) {
        this.userRequest = userRequest;
    }

    public List<ProductInfo> getProducts() {
        return products;
    }

    public void setProducts(
            List<ProductInfo> products
    ) {
        this.products = products;
    }

    // ============================================================
    // PRODUCT INFO
    // ============================================================

    public static class ProductInfo {

        private Long id;

        private String name;

        private String categoryName;

        private String description;

        private BigDecimal price;

        private Integer stock;

        public ProductInfo() {
        }

        public ProductInfo(
                Long id,
                String name,
                String categoryName,
                String description,
                BigDecimal price,
                Integer stock
        ) {
            this.id = id;
            this.name = name;
            this.categoryName = categoryName;
            this.description = description;
            this.price = price;
            this.stock = stock;
        }

        public Long getId() {
            return id;
        }

        public void setId(
                Long id
        ) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(
                String name
        ) {
            this.name = name;
        }

        public String getCategoryName() {
            return categoryName;
        }

        public void setCategoryName(
                String categoryName
        ) {
            this.categoryName = categoryName;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(
                String description
        ) {
            this.description = description;
        }

        public BigDecimal getPrice() {
            return price;
        }

        public void setPrice(
                BigDecimal price
        ) {
            this.price = price;
        }

        public Integer getStock() {
            return stock;
        }

        public void setStock(
                Integer stock
        ) {
            this.stock = stock;
        }
    }
}