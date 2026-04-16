package com.f1.f1_analytics.service;

import com.f1.f1_analytics.dto.*;
import com.f1.f1_analytics.repository.LapTimeRepository;
import com.f1.f1_analytics.repository.PitStopRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnalyticsService {

    private final LapTimeRepository lapTimeRepository;
    private final PitStopRepository pitStopRepository;

    public AnalyticsService(LapTimeRepository lapTimeRepository,
                            PitStopRepository pitStopRepository) {
        this.lapTimeRepository = lapTimeRepository;
        this.pitStopRepository = pitStopRepository;
    }

    public List<LapTimeTrendDTO> getLapTimeTrends(Integer raceId) {
        return lapTimeRepository.getLapTimeTrends(raceId)
                .stream()
                .map(obj -> new LapTimeTrendDTO(
                        obj[0] + " " + obj[1],
                        ((Number) obj[2]).doubleValue()
                ))
                .toList();
    }

    public List<PitStopImpactDTO> getPitStopImpact(Integer raceId) {
        return pitStopRepository.getPitStopImpact(raceId)
                .stream()
                .map(obj -> new PitStopImpactDTO(
                        obj[0] + " " + obj[1],
                        ((Number) obj[2]).doubleValue()
                ))
                .toList();
    }
}