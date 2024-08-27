package com.akay.ecommerce.controller;


import com.akay.ecommerce.entity.Vendor;
import com.akay.ecommerce.service.VendorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("vendor")
public class VendorController {

    private final VendorService vendorService;

    public VendorController(VendorService vendorService) {
        this.vendorService = vendorService;
    }

    @GetMapping
    public ResponseEntity<List<Vendor>> getVendors() {
        return ResponseEntity.ok(vendorService.getVendors());
    }

    @GetMapping("/{vendor-id}")
    public ResponseEntity<Vendor> getVendorById(@PathVariable("vendor-id") Long id) {
        try {
            Vendor vendor = vendorService.getVendorById(id);
            return ResponseEntity.ok(vendor);
        } catch (RuntimeException e) {
            System.err.println("Error: " + e.getMessage());
        }
        return ResponseEntity.status(404).body(null);
    }

    @GetMapping("/name/{vendor-name}")
    public ResponseEntity<Vendor> getVendorByName(@PathVariable("vendor-name") String name) {
        try {
            Vendor vendor = vendorService.getVendorByName(name);
            return ResponseEntity.ok(vendor);
        } catch (RuntimeException e) {
            System.err.println("Error: " + e.getMessage());
        }
        return ResponseEntity.status(404).body(null);
    }



    @PostMapping("/add")
    public ResponseEntity<Vendor> addVendor(@RequestBody Vendor vendor) {
        try{
            Vendor savedVendor = vendorService.saveVendor(vendor);
            return ResponseEntity.ok(savedVendor);
        }
        catch (RuntimeException e) {
            System.err.println("Error: " + e.getMessage());
        }
        return ResponseEntity.status(400).body(null);
    }

}
