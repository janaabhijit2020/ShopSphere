package com.shopsphere.backend.ai;

import java.util.List;

public class AIChatRequest {

    private String message;

    private List<AIRecommendationRequest.ProductInfo> products;

    public AIChatRequest() {
    }

    public AIChatRequest(
            String message,
            List<AIRecommendationRequest.ProductInfo> products
    ) {
        this.message = message;
        this.products = products;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(
            String message
    ) {
        this.message = message;
    }

    public List<AIRecommendationRequest.ProductInfo> getProducts() {
        return products;
    }

    public void setProducts(
            List<AIRecommendationRequest.ProductInfo> products
    ) {
        this.products = products;
    }
}