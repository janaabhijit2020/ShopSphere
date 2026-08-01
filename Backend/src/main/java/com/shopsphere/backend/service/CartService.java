package com.shopsphere.backend.service;

import com.shopsphere.backend.dto.cart.CartRequest;
import com.shopsphere.backend.dto.cart.CartResponse;

public interface CartService {

    CartResponse addToCart(CartRequest request);

    CartResponse getMyCart();

    CartResponse updateQuantity(
            Long cartItemId,
            Integer quantity
    );

    void removeItem(Long cartItemId);

    void clearCart();
}