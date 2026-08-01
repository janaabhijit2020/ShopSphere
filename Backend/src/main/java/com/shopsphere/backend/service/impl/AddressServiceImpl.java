package com.shopsphere.backend.service.impl;

import com.shopsphere.backend.dto.address.AddressRequest;
import com.shopsphere.backend.dto.address.AddressResponse;
import com.shopsphere.backend.entity.Address;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.repository.AddressRepository;
import com.shopsphere.backend.service.AddressService;
import com.shopsphere.backend.service.CurrentUserService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final CurrentUserService currentUserService;

    public AddressServiceImpl(AddressRepository addressRepository,
                              CurrentUserService currentUserService) {
        this.addressRepository = addressRepository;
        this.currentUserService = currentUserService;
    }

    @Override
    public AddressResponse addAddress(AddressRequest request) {

        User user = currentUserService.getCurrentUser();

        if (Boolean.TRUE.equals(request.getIsDefault())) {

            addressRepository.findByUserIdAndIsDefaultTrue(user.getId())
                    .ifPresent(address -> {
                        address.setIsDefault(false);
                        addressRepository.save(address);
                    });
        }

        Address address = new Address();
        address.setFullName(request.getFullName());
        address.setMobileNumber(request.getMobileNumber());
        address.setAddressLine1(request.getAddressLine1());
        address.setAddressLine2(request.getAddressLine2());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPostalCode(request.getPostalCode());
        address.setCountry(request.getCountry());
        address.setIsDefault(request.getIsDefault());
        address.setUser(user);

        Address saved = addressRepository.save(address);

        return mapToResponse(saved);
    }

    @Override
    public List<AddressResponse> getMyAddresses() {

        User user = currentUserService.getCurrentUser();

        return addressRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AddressResponse updateAddress(Long addressId,
                                         AddressRequest request) {

        User user = currentUserService.getCurrentUser();

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You cannot update another user's address");
        }

        if (Boolean.TRUE.equals(request.getIsDefault())) {

            addressRepository.findByUserIdAndIsDefaultTrue(user.getId())
                    .ifPresent(a -> {
                        a.setIsDefault(false);
                        addressRepository.save(a);
                    });
        }

        address.setFullName(request.getFullName());
        address.setMobileNumber(request.getMobileNumber());
        address.setAddressLine1(request.getAddressLine1());
        address.setAddressLine2(request.getAddressLine2());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPostalCode(request.getPostalCode());
        address.setCountry(request.getCountry());
        address.setIsDefault(request.getIsDefault());

        Address updated = addressRepository.save(address);

        return mapToResponse(updated);
    }

    @Override
    public void deleteAddress(Long addressId) {

        User user = currentUserService.getCurrentUser();

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You cannot delete another user's address");
        }

        addressRepository.delete(address);
    }

    private AddressResponse mapToResponse(Address address) {

        return new AddressResponse(
                address.getId(),
                address.getFullName(),
                address.getMobileNumber(),
                address.getAddressLine1(),
                address.getAddressLine2(),
                address.getCity(),
                address.getState(),
                address.getPostalCode(),
                address.getCountry(),
                address.getIsDefault()
        );
    }
}