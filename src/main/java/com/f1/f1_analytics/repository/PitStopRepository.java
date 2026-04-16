package com.f1.f1_analytics.repository;

import com.f1.f1_analytics.entity.PitStop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PitStopRepository extends JpaRepository<PitStop, Integer> {

    @Query(value = """
        SELECT d.first_name, d.last_name, AVG(p.duration)
        FROM pit_stops p
        JOIN drivers d ON p.driver_id = d.id
        WHERE p.race_id = :raceId
        GROUP BY d.id, d.first_name, d.last_name
        ORDER BY AVG(p.duration)
    """, nativeQuery = true)
    List<Object[]> getPitStopImpact(Integer raceId);
}