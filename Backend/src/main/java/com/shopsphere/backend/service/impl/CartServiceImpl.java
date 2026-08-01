package com.shopsphere.backend.service.impl;

import com.shopsphere.backend.dto.cart.CartItemResponse;
import com.shopsphere.backend.dto.cart.CartRequest;
import com.shopsphere.backend.dto.cart.CartResponse;
import com.shopsphere.backend.entity.Cart;
import com.shopsphere.backend.entity.CartItem;
import com.shopsphere.backend.entity.Product;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.repository.CartItemRepository;
import com.shopsphere.backend.repository.CartRepository;
import com.shopsphere.backend.repository.ProductRepository;
import com.shopsphere.backend.service.CartService;
import com.shopsphere.backend.service.CurrentUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CurrentUserService currentUserService;

    @Override
    public CartResponse addToCart(CartRequest request) {

        User user = currentUserService.getCurrentUser();

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });

        // Check if product already exists in cart
        CartItem existingItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(
                    existingItem.getQuantity() + request.getQuantity()
            );
            cartItemRepository.save(existingItem);
        } else {

            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(request.getQuantity());
            item.setPrice(product.getPrice());

            cart.getCartItems().add(item);
            cartItemRepository.save(item);
        }

        return getMyCart();
    }

    @Override
    public CartResponse getMyCart() {

        User user = currentUserService.getCurrentUser();

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItemResponse> items = new ArrayList<>();

        BigDecimal grandTotal = BigDecimal.ZERO;

        for (CartItem item : cart.getCartItems()) {

            BigDecimal totalPrice = item.getPrice()
                    .multiply(BigDecimal.valueOf(item.getQuantity()));

            grandTotal = grandTotal.add(totalPrice);

            items.add(new CartItemResponse(
                    item.getId(),
                    item.getProduct().getId(),
                    item.getProduct().getName(),
                    item.getQuantity(),
                    item.getPrice(),
                    totalPrice
            ));
        }

        return new CartResponse(
                cart.getId(),
                user.getId(),
                items,
                grandTotal
        );
    }
    @Override
    public CartResponse updateQuantity(
            Long cartItemId,
            Integer quantity
    ) {

        if (quantity == null || quantity < 1) {
            throw new RuntimeException(
                    "Quantity must be at least 1"
            );
        }

        User user = currentUserService.getCurrentUser();

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new RuntimeException("Cart not found")
                );

        CartItem item = cartItemRepository
                .findById(cartItemId)
                .orElseThrow(() ->
                        new RuntimeException("Cart item not found")
                );

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException(
                    "You cannot update another user's cart item"
            );
        }

        item.setQuantity(quantity);

        cartItemRepository.save(item);

        return getMyCart();
    }
    @Override
    public void removeItem(Long cartItemId) {

        User user = currentUserService.getCurrentUser();

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("You cannot remove another user's cart item");
        }

        cartItemRepository.delete(item);
    }

    @Override
    public void clearCart() {

        User user = currentUserService.getCurrentUser();

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.getCartItems().clear();

        cartRepository.save(cart);
    }
}