package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.wishlist.WishlistResponse;
import com.shopsphere.backend.service.WishlistService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @PostMapping("/{productId}")
    public WishlistResponse addToWishlist(@PathVariable Long productId) {
        return wishlistService.addToWishlist(productId);
    }

    @GetMapping
    public List<WishlistResponse> getMyWishlist() {
        return wishlistService.getMyWishlist();
    }

    @DeleteMapping("/{productId}")
    public String removeFromWishlist(@PathVariable Long productId) {

        wishlistService.removeFromWishlist(productId);

        return "Product removed from wishlist successfully";
    }
}