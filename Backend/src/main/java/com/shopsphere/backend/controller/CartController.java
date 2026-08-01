package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.cart.CartRequest;
import com.shopsphere.backend.dto.cart.CartResponse;
import com.shopsphere.backend.service.CartService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/add")
    public CartResponse addToCart(@RequestBody CartRequest request) {
        return cartService.addToCart(request);
    }

    @GetMapping
    public CartResponse getMyCart() {
        return cartService.getMyCart();
    }
    @PutMapping("/item/{cartItemId}")
    public CartResponse updateQuantity(
            @PathVariable Long cartItemId,
            @RequestBody CartRequest request
    ) {

        return cartService.updateQuantity(
                cartItemId,
                request.getQuantity()
        );
    }

    @DeleteMapping("/item/{cartItemId}")
    public String removeItem(@PathVariable Long cartItemId) {

        cartService.removeItem(cartItemId);

        return "Item removed successfully";
    }

    @DeleteMapping("/clear")
    public String clearCart() {

        cartService.clearCart();

        return "Cart cleared successfully";
    }
}