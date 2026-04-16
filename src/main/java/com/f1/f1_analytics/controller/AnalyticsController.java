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

    @GetMapping("/lap-times/{raceId}")
    public List<LapTimeTrendDTO> getLapTimes(@PathVariable Integer raceId) {
        return analyticsService.getLapTimeTrends(raceId);
    }

    @GetMapping("/pit-stops/{raceId}")
    public List<PitStopImpactDTO> getPitStops(@PathVariable Integer raceId) {
        return analyticsService.getPitStopImpact(raceId);
    }
}