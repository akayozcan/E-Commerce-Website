package com.akay.ecommerce.service;

import com.akay.ecommerce.entity.Vendor;
import com.akay.ecommerce.repository.VendorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VendorService {

    private final VendorRepository vendorRepository;

    public VendorService(VendorRepository vendorRepository) {
        this.vendorRepository = vendorRepository;
    }


    public List<Vendor> getVendors() {
        return vendorRepository.findAll();
    }

    public Vendor getVendorById(Long id) {
        return vendorRepository.findById(id).orElseThrow(() -> new RuntimeException("Vendor not found"));
    }

    public Vendor getVendorByName(String name) {
        return vendorRepository.findByName(name).orElseThrow(() -> new RuntimeException("Vendor not found"));
    }
    public Vendor saveVendor(Vendor vendor) {
        if (vendorRepository.findByName(vendor.getName()).isPresent()) {
            throw new RuntimeException("Vendor already exists");
        }
        return vendorRepository.save(vendor);
    }
}
