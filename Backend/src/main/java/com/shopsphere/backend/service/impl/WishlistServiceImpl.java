package com.shopsphere.backend.service.impl;

import com.shopsphere.backend.dto.wishlist.WishlistResponse;
import com.shopsphere.backend.entity.Product;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.entity.Wishlist;
import com.shopsphere.backend.repository.ProductRepository;
import com.shopsphere.backend.repository.WishlistRepository;
import com.shopsphere.backend.service.CurrentUserService;
import com.shopsphere.backend.service.WishlistService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final CurrentUserService currentUserService;

    public WishlistServiceImpl(WishlistRepository wishlistRepository,
                               ProductRepository productRepository,
                               CurrentUserService currentUserService) {
        this.wishlistRepository = wishlistRepository;
        this.productRepository = productRepository;
        this.currentUserService = currentUserService;
    }

    @Override
    public WishlistResponse addToWishlist(Long productId) {

        User user = currentUserService.getCurrentUser();

        if (wishlistRepository.findByUserIdAndProductId(user.getId(), productId).isPresent()) {
            throw new RuntimeException("Product already exists in wishlist");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setProduct(product);

        wishlist = wishlistRepository.save(wishlist);

        return new WishlistResponse(
                wishlist.getId(),
                product.getId(),
                product.getName(),
                product.getPrice()
        );
    }

    @Override
    public List<WishlistResponse> getMyWishlist() {

        User user = currentUserService.getCurrentUser();

        List<Wishlist> wishlistItems = wishlistRepository.findByUserId(user.getId());

        List<WishlistResponse> response = new ArrayList<>();

        for (Wishlist item : wishlistItems) {
            response.add(new WishlistResponse(
                    item.getId(),
                    item.getProduct().getId(),
                    item.getProduct().getName(),
                    item.getProduct().getPrice()
            ));
        }

        return response;
    }

    @Override
    public void removeFromWishlist(Long productId) {

        User user = currentUserService.getCurrentUser();

        wishlistRepository.deleteByUserIdAndProductId(user.getId(), productId);
    }
}