package com.shopsphere.backend.dto.review;

import java.time.LocalDateTime;

public class ReviewResponse {

    private Long reviewId;
    private String customerName;
    private String productName;
    private Integer rating;
    private String comment;
    private LocalDateTime reviewDate;

    public ReviewResponse(Long reviewId,
                          String customerName,
                          String productName,
                          Integer rating,
                          String comment,
                          LocalDateTime reviewDate) {

        this.reviewId = reviewId;
        this.customerName = customerName;
        this.productName = productName;
        this.rating = rating;
        this.comment = comment;
        this.reviewDate = reviewDate;
    }

    public Long getReviewId() {
        return reviewId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getProductName() {
        return productName;
    }

    public Integer getRating() {
        return rating;
    }

    public String getComment() {
        return comment;
    }

    public LocalDateTime getReviewDate() {
        return reviewDate;
    }
}