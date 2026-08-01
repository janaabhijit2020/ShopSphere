package com.shopsphere.backend.service.impl;

import com.shopsphere.backend.entity.Product;
import com.shopsphere.backend.entity.Review;
import com.shopsphere.backend.entity.User;
import java.time.LocalDateTime;
import java.util.stream.Collectors;
import com.shopsphere.backend.dto.review.ReviewRequest;
import com.shopsphere.backend.dto.review.ReviewResponse;
import com.shopsphere.backend.repository.ProductRepository;
import com.shopsphere.backend.repository.ReviewRepository;
import com.shopsphere.backend.service.CurrentUserService;
import com.shopsphere.backend.service.ReviewService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final CurrentUserService currentUserService;

    public ReviewServiceImpl(ReviewRepository reviewRepository,
                             ProductRepository productRepository,
                             CurrentUserService currentUserService) {

        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.currentUserService = currentUserService;
    }

    @Override
    public ReviewResponse addReview(ReviewRequest request) {

        User user = currentUserService.getCurrentUser();

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (reviewRepository.findByUserIdAndProductId(user.getId(), product.getId()).isPresent()) {
            throw new RuntimeException("You have already reviewed this product");
        }

        Review review = new Review();

        review.setUser(user);
        review.setProduct(product);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setReviewDate(LocalDateTime.now());

        Review saved = reviewRepository.save(review);

        return new ReviewResponse(
                saved.getId(),
                user.getFirstName() + " " + user.getLastName(),
                product.getName(),
                saved.getRating(),
                saved.getComment(),
                saved.getReviewDate()
        );
    }
    @Override
    public List<ReviewResponse> getReviewsByProduct(Long productId) {

        return reviewRepository.findByProductId(productId)
                .stream()
                .map(review -> new ReviewResponse(
                        review.getId(),
                        review.getUser().getFirstName() + " " + review.getUser().getLastName(),
                        review.getProduct().getName(),
                        review.getRating(),
                        review.getComment(),
                        review.getReviewDate()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public ReviewResponse updateReview(Long reviewId, ReviewRequest request) {

        User user = currentUserService.getCurrentUser();

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You cannot update another user's review");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review updated = reviewRepository.save(review);

        return new ReviewResponse(
                updated.getId(),
                user.getFirstName() + " " + user.getLastName(),
                updated.getProduct().getName(),
                updated.getRating(),
                updated.getComment(),
                updated.getReviewDate()
        );
    }

    @Override
    public void deleteReview(Long reviewId) {

        User user = currentUserService.getCurrentUser();

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You cannot delete another user's review");
        }

        reviewRepository.delete(review);
    }
}