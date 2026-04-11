package com.f1.f1_analytics.repository;

import com.f1.f1_analytics.entity.Race;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RaceRepository extends JpaRepository<Race, Integer> {
}