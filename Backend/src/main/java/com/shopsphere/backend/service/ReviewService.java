package com.shopsphere.backend.service;

import com.shopsphere.backend.dto.review.ReviewRequest;
import com.shopsphere.backend.dto.review.ReviewResponse;

import java.util.List;

public interface ReviewService {

    ReviewResponse addReview(ReviewRequest request);

    List<ReviewResponse> getReviewsByProduct(Long productId);

    ReviewResponse updateReview(Long reviewId, ReviewRequest request);

    void deleteReview(Long reviewId);
}