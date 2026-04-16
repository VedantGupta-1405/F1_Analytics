package com.f1.f1_analytics.controller;

import com.f1.f1_analytics.dto.*;
import com.f1.f1_analytics.service.AnalyticsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    // 🔥 DRIVER SCORE (NEW)
    @GetMapping("/driver-score/{raceId}")
    public List<DriverScoreDTO> getDriverScores(@PathVariable Integer raceId) {
        return analyticsService.getDriverScores(raceId);
    }
}