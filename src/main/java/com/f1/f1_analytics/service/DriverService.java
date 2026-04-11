package com.f1.f1_analytics.service;

import com.f1.f1_analytics.entity.Driver;
import com.f1.f1_analytics.repository.DriverRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class DriverService {

    private final DriverRepository driverRepository;

    public DriverService(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    // ✅ Pagination + Filtering
    public Page<Driver> getDrivers(String nationality, Pageable pageable) {
        if (nationality != null && !nationality.isEmpty()) {
            return driverRepository.findByNationality(nationality, pageable);
        }
        return driverRepository.findAll(pageable);
    }

    // ✅ Single driver
    public Driver getDriverById(Integer id) {
        return driverRepository.findById(id).orElse(null);
    }
}