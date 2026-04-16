package com.f1.f1_analytics.repository;

import com.f1.f1_analytics.entity.LapTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LapTimeRepository extends JpaRepository<LapTime, Integer> {

    // ✅ Lap Time Trends (avg per driver)
    @Query(value = """
        SELECT d.first_name, d.last_name, AVG(l.lap_time)
        FROM lap_times l
        JOIN drivers d ON l.driver_id = d.id
        WHERE l.race_id = :raceId
        GROUP BY d.id, d.first_name, d.last_name
        ORDER BY AVG(l.lap_time)
    """, nativeQuery = true)
    List<Object[]> getLapTimeTrends(Integer raceId);

    // ✅ Pace Comparison
    @Query(value = """
        SELECT d.first_name, d.last_name, AVG(l.lap_time)
        FROM lap_times l
        JOIN drivers d ON l.driver_id = d.id
        WHERE l.race_id = :raceId
        GROUP BY d.id, d.first_name, d.last_name
        ORDER BY AVG(l.lap_time)
    """, nativeQuery = true)
    List<Object[]> getPaceComparison(Integer raceId);

    // ✅ Fastest Lap
    @Query(value = """
        SELECT d.first_name, d.last_name, MIN(l.lap_time)
        FROM lap_times l
        JOIN drivers d ON l.driver_id = d.id
        WHERE l.race_id = :raceId
        GROUP BY d.id, d.first_name, d.last_name
        ORDER BY MIN(l.lap_time)
    """, nativeQuery = true)
    List<Object[]> getFastestLaps(Integer raceId);

    // ✅ Consistency (STDDEV) 🔥
    @Query(value = """
        SELECT d.first_name, d.last_name, STDDEV(l.lap_time)
        FROM lap_times l
        JOIN drivers d ON l.driver_id = d.id
        WHERE l.race_id = :raceId
        GROUP BY d.id, d.first_name, d.last_name
        ORDER BY STDDEV(l.lap_time)
    """, nativeQuery = true)
    List<Object[]> getConsistency(Integer raceId);
}