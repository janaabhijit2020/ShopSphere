package com.shopsphere.backend.dto.order;

import jakarta.validation.constraints.NotNull;

public class PlaceOrderRequest {

    @NotNull
    private Long addressId;

    public PlaceOrderRequest() {
    }

    public Long getAddressId() {
        return addressId;
    }

    public void setAddressId(Long addressId) {
        this.addressId = addressId;
    }
}