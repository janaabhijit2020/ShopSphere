package com.shopsphere.backend.service;

import com.shopsphere.backend.dto.address.AddressRequest;
import com.shopsphere.backend.dto.address.AddressResponse;

import java.util.List;

public interface AddressService {

    AddressResponse addAddress(AddressRequest request);

    List<AddressResponse> getMyAddresses();

    AddressResponse updateAddress(Long addressId, AddressRequest request);

    void deleteAddress(Long addressId);
}