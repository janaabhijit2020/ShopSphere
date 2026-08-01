package com.shopsphere.backend.dto.wishlist;

import java.math.BigDecimal;

public class WishlistResponse {

    private Long wishlistId;
    private Long productId;
    private String productName;
    private BigDecimal price;

    public WishlistResponse() {
    }

    public WishlistResponse(Long wishlistId,
                            Long productId,
                            String productName,
                            BigDecimal price) {
        this.wishlistId = wishlistId;
        this.productId = productId;
        this.productName = productName;
        this.price = price;
    }

    public Long getWishlistId() {
        return wishlistId;
    }

    public void setWishlistId(Long wishlistId) {
        this.wishlistId = wishlistId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}