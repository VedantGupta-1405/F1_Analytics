package com.f1.f1_analytics.controller;

import com.f1.f1_analytics.dto.*;
import com.f1.f1_analytics.service.AnalyticsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map; // ✅ ADDED

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    // ✅ Lap Time Trends
    @GetMapping("/lap-times/{raceId}")
    public List<LapTimeTrendDTO> getLapTimes(@PathVariable Integer raceId) {
        return analyticsService.getLapTimeTrends(raceId);
    }

    // ✅ Pit Stop Impact
    @GetMapping("/pit-stops/{raceId}")
    public List<PitStopImpactDTO> getPitStops(@PathVariable Integer raceId) {
        return analyticsService.getPitStopImpact(raceId);
    }

    // ✅ Pace Comparison
    @GetMapping("/pace/{raceId}")
    public List<PaceComparisonDTO> getPaceComparison(@PathVariable Integer raceId) {
        return analyticsService.getPaceComparison(raceId);
    }

    // ✅ Fastest Lap
    @GetMapping("/fastest-lap/{raceId}")
    public List<FastestLapDTO> getFastestLap(@PathVariable Integer raceId) {
        return analyticsService.getFastestLaps(raceId);
    }

    // ✅ Consistency
    @GetMapping("/consistency/{raceId}")
    public List<ConsistencyDTO> getConsistency(@PathVariable Integer raceId) {
        return analyticsService.getConsistency(raceId);
    }

    // ✅ Driver Score
    @GetMapping("/driver-score/{raceId}")
    public List<DriverScoreDTO> getDriverScores(@PathVariable Integer raceId) {
        return analyticsService.getDriverScores(raceId);
    }

    // ✅ Decision
    @GetMapping("/decision/{raceId}")
    public DecisionDTO getDecision(@PathVariable Integer raceId) {
        return analyticsService.getBestDriverDecision(raceId);
    }

    // 🔥 DRIVER COMPARISON
    @GetMapping("/compare")
    public DriverComparisonDTO compareDrivers(
            @RequestParam String driver1,
            @RequestParam String driver2,
            @RequestParam Integer raceId) {

        return analyticsService.compareDrivers(driver1, driver2, raceId);
    }

    // 🔥 NEW — ML PREDICTION ENDPOINT
    @GetMapping("/prediction")
    public Map<String, Object> getPrediction(
            @RequestParam Integer driverId,
            @RequestParam Integer raceId) {

        return analyticsService.getPrediction(driverId, raceId);
    }
}