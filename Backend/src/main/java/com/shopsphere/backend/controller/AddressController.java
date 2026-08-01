package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.address.AddressRequest;
import com.shopsphere.backend.dto.address.AddressResponse;
import com.shopsphere.backend.service.AddressService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/address")
@CrossOrigin(origins = "*")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @PostMapping
    public AddressResponse addAddress(@Valid @RequestBody AddressRequest request) {
        return addressService.addAddress(request);
    }

    @GetMapping
    public List<AddressResponse> getMyAddresses() {
        return addressService.getMyAddresses();
    }

    @PutMapping("/{id}")
    public AddressResponse updateAddress(@PathVariable Long id,
                                         @Valid @RequestBody AddressRequest request) {

        return addressService.updateAddress(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteAddress(@PathVariable Long id) {

        addressService.deleteAddress(id);

        return "Address deleted successfully";
    }
}