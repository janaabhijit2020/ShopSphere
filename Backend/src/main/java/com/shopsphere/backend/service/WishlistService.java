package com.shopsphere.backend.service;

import com.shopsphere.backend.dto.wishlist.WishlistResponse;

import java.util.List;

public interface WishlistService {

    WishlistResponse addToWishlist(Long productId);

    List<WishlistResponse> getMyWishlist();

    void removeFromWishlist(Long productId);
}