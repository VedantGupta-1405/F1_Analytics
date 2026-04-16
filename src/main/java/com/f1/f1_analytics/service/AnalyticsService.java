package com.f1.f1_analytics.service;

import com.f1.f1_analytics.dto.*;
import com.f1.f1_analytics.repository.LapTimeRepository;
import com.f1.f1_analytics.repository.PitStopRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final LapTimeRepository lapTimeRepository;
    private final PitStopRepository pitStopRepository;

    public AnalyticsService(LapTimeRepository lapTimeRepository,
                            PitStopRepository pitStopRepository) {
        this.lapTimeRepository = lapTimeRepository;
        this.pitStopRepository = pitStopRepository;
    }

    // ✅ Lap Time Trends
    public List<LapTimeTrendDTO> getLapTimeTrends(Integer raceId) {
        return lapTimeRepository.getLapTimeTrends(raceId)
                .stream()
                .map(obj -> new LapTimeTrendDTO(
                        obj[0] + " " + obj[1],
                        ((Number) obj[2]).doubleValue()
                ))
                .toList();
    }

    // ✅ Pit Stop Impact
    public List<PitStopImpactDTO> getPitStopImpact(Integer raceId) {
        return pitStopRepository.getPitStopImpact(raceId)
                .stream()
                .map(obj -> new PitStopImpactDTO(
                        obj[0] + " " + obj[1],
                        ((Number) obj[2]).doubleValue()
                ))
                .toList();
    }

    // ✅ Pace Comparison
    public List<PaceComparisonDTO> getPaceComparison(Integer raceId) {
        return lapTimeRepository.getPaceComparison(raceId)
                .stream()
                .map(obj -> new PaceComparisonDTO(
                        obj[0] + " " + obj[1],
                        ((Number) obj[2]).doubleValue()
                ))
                .toList();
    }

    // ✅ Fastest Lap
    public List<FastestLapDTO> getFastestLaps(Integer raceId) {
        return lapTimeRepository.getFastestLaps(raceId)
                .stream()
                .map(obj -> new FastestLapDTO(
                        obj[0] + " " + obj[1],
                        ((Number) obj[2]).doubleValue()
                ))
                .toList();
    }

    // ✅ Consistency
    public List<ConsistencyDTO> getConsistency(Integer raceId) {
        return lapTimeRepository.getConsistency(raceId)
                .stream()
                .map(obj -> new ConsistencyDTO(
                        obj[0] + " " + obj[1],
                        ((Number) obj[2]).doubleValue()
                ))
                .toList();
    }

    // 🔥 DRIVER SCORE ENGINE (FINAL)
    public List<DriverScoreDTO> getDriverScores(Integer raceId) {

        List<PaceComparisonDTO> pace = getPaceComparison(raceId);
        List<FastestLapDTO> fastest = getFastestLaps(raceId);
        List<ConsistencyDTO> consistency = getConsistency(raceId);
        List<PitStopImpactDTO> pit = getPitStopImpact(raceId);

        Map<String, Double> paceMap = pace.stream()
                .collect(Collectors.toMap(PaceComparisonDTO::getDriverName, PaceComparisonDTO::getAvgLapTime));

        Map<String, Double> fastMap = fastest.stream()
                .collect(Collectors.toMap(FastestLapDTO::getDriverName, FastestLapDTO::getFastestLap));

        Map<String, Double> consistencyMap = consistency.stream()
                .collect(Collectors.toMap(ConsistencyDTO::getDriverName, ConsistencyDTO::getConsistency));

        Map<String, Double> pitMap = pit.stream()
                .collect(Collectors.toMap(PitStopImpactDTO::getDriverName, PitStopImpactDTO::getAvgPitDuration));

        // 🔥 NORMALIZATION RANGE
        double paceMin = Collections.min(paceMap.values());
        double paceMax = Collections.max(paceMap.values());

        double fastMin = Collections.min(fastMap.values());
        double fastMax = Collections.max(fastMap.values());

        double consistencyMin = Collections.min(consistencyMap.values());
        double consistencyMax = Collections.max(consistencyMap.values());

        double pitMin = Collections.min(pitMap.values());
        double pitMax = Collections.max(pitMap.values());

        List<DriverScoreDTO> scores = new ArrayList<>();

        // 🔥 FIXED LOOP (ALL DRIVERS INCLUDED)
        Set<String> drivers = new HashSet<>();
        drivers.addAll(paceMap.keySet());
        drivers.addAll(fastMap.keySet());
        drivers.addAll(consistencyMap.keySet());
        drivers.addAll(pitMap.keySet());

        for (String driver : drivers) {

            double paceNorm = normalizeInverse(paceMap.getOrDefault(driver, paceMax), paceMin, paceMax);
            double fastNorm = normalizeInverse(fastMap.getOrDefault(driver, fastMax), fastMin, fastMax);
            double consistencyNorm = normalizeInverse(consistencyMap.getOrDefault(driver, consistencyMax), consistencyMin, consistencyMax);
            double pitNorm = normalizeInverse(pitMap.getOrDefault(driver, pitMax), pitMin, pitMax);

            double finalScore =
                    (0.4 * paceNorm) +
                    (0.3 * fastNorm) +
                    (0.2 * consistencyNorm) +
                    (0.1 * pitNorm);

            scores.add(new DriverScoreDTO(driver, finalScore));
        }

        return scores.stream()
                .sorted((a, b) -> Double.compare(b.getScore(), a.getScore()))
                .toList();
    }

    // 🔥 NORMALIZATION FUNCTION
    private double normalizeInverse(double value, double min, double max) {
        if (max - min == 0) return 1.0;
        return (max - value) / (max - min);
    }
}