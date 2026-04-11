package com.f1.f1_analytics.controller;

import com.f1.f1_analytics.entity.Driver;
import com.f1.f1_analytics.service.DriverService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/drivers")
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    // ✅ Pagination + Filtering
    @GetMapping
    public Page<Driver> getDrivers(
            @RequestParam(required = false) String nationality,
            Pageable pageable) {
        return driverService.getDrivers(nationality, pageable);
    }

    // ✅ Single driver
    @GetMapping("/{id}")
    public Driver getDriverById(@PathVariable Integer id) {
        return driverService.getDriverById(id);
    }
}