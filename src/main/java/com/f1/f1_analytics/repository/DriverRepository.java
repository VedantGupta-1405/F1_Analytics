package com.f1.f1_analytics.repository;

import com.f1.f1_analytics.entity.Driver;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DriverRepository extends JpaRepository<Driver, Integer> {

    // ✅ Filtering by nationality with pagination
    Page<Driver> findByNationality(String nationality, Pageable pageable);
}   