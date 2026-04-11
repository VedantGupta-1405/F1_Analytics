package com.f1.f1_analytics.repository;

import com.f1.f1_analytics.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ResultRepository extends JpaRepository<Result, Integer> {

    // Existing
    List<Result> findByRaceId(Integer raceId);

    // ✅ Analytics: Top drivers by wins
    @Query("""
        SELECT r.driver.firstName, r.driver.lastName, COUNT(r)
        FROM Result r
        WHERE r.finishPosition = 1
        GROUP BY r.driver.id, r.driver.firstName, r.driver.lastName
        ORDER BY COUNT(r) DESC
    """)
    List<Object[]> getTopDriversByWins();
}