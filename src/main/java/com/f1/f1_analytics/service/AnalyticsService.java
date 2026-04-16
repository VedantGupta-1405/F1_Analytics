package com.f1.f1_analytics.service;

import com.f1.f1_analytics.dto.*;
import com.f1.f1_analytics.repository.LapTimeRepository;
import com.f1.f1_analytics.repository.PitStopRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final LapTimeRepository lapTimeRepository;
    private final PitStopRepository pitStopRepository;

    private final String ML_URL = "http://127.0.0.1:8000/predict";

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

    public List<PaceComparisonDTO> getPaceComparison(Integer raceId) {
        return lapTimeRepository.getPaceComparison(raceId)
                .stream()
                .map(obj -> new PaceComparisonDTO(
                        obj[0] + " " + obj[1],
                        ((Number) obj[2]).doubleValue()
                ))
                .toList();
    }

    public List<FastestLapDTO> getFastestLaps(Integer raceId) {
        return lapTimeRepository.getFastestLaps(raceId)
                .stream()
                .map(obj -> new FastestLapDTO(
                        obj[0] + " " + obj[1],
                        ((Number) obj[2]).doubleValue()
                ))
                .toList();
    }

    public List<ConsistencyDTO> getConsistency(Integer raceId) {
        return lapTimeRepository.getConsistency(raceId)
                .stream()
                .map(obj -> new ConsistencyDTO(
                        obj[0] + " " + obj[1],
                        ((Number) obj[2]).doubleValue()
                ))
                .toList();
    }

    // 🔥 FIXED ML CALL (ONLY CHANGE HERE)
    public Map<String, Object> getPrediction(Integer driverId, Integer raceId) {

        RestTemplate restTemplate = new RestTemplate();

        String url = ML_URL + "?driver_id=" + driverId + "&race_id=" + raceId;

        try {
            return restTemplate.postForObject(url, "", Map.class);
        } catch (Exception e) {
            return Map.of(
                    "error", "ML service unavailable",
                    "details", e.getMessage()
            );
        }
    }

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

        double paceMin = Collections.min(paceMap.values());
        double paceMax = Collections.max(paceMap.values());

        double fastMin = Collections.min(fastMap.values());
        double fastMax = Collections.max(fastMap.values());

        double consistencyMin = Collections.min(consistencyMap.values());
        double consistencyMax = Collections.max(consistencyMap.values());

        double pitMin = Collections.min(pitMap.values());
        double pitMax = Collections.max(pitMap.values());

        List<DriverScoreDTO> scores = new ArrayList<>();

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

    public DecisionDTO getBestDriverDecision(Integer raceId) {

        List<DriverScoreDTO> scores = getDriverScores(raceId);

        if (scores.isEmpty()) {
            return new DecisionDTO("N/A", 0.0, "No data available");
        }

        DriverScoreDTO top = scores.get(0);

        List<PaceComparisonDTO> pace = getPaceComparison(raceId);
        List<ConsistencyDTO> consistency = getConsistency(raceId);
        List<FastestLapDTO> fastest = getFastestLaps(raceId);

        Map<String, Double> paceMap = pace.stream()
                .collect(Collectors.toMap(PaceComparisonDTO::getDriverName, PaceComparisonDTO::getAvgLapTime));

        Map<String, Double> consistencyMap = consistency.stream()
                .collect(Collectors.toMap(ConsistencyDTO::getDriverName, ConsistencyDTO::getConsistency));

        Map<String, Double> fastMap = fastest.stream()
                .collect(Collectors.toMap(FastestLapDTO::getDriverName, FastestLapDTO::getFastestLap));

        String driver = top.getDriverName();

        double paceVal = paceMap.getOrDefault(driver, 0.0);
        double consistencyVal = consistencyMap.getOrDefault(driver, 0.0);
        double fastVal = fastMap.getOrDefault(driver, 0.0);

        String reason = String.format(
                "Best pace (%.2fs avg), fastest lap (%.2fs), and strong consistency (%.2f)",
                paceVal,
                fastVal,
                consistencyVal
        );

        return new DecisionDTO(
                driver,
                top.getScore(),
                reason
        );
    }

    public DriverComparisonDTO compareDrivers(String driver1, String driver2, Integer raceId) {

        List<DriverScoreDTO> scores = getDriverScores(raceId);

        Map<String, Double> scoreMap = scores.stream()
                .collect(Collectors.toMap(DriverScoreDTO::getDriverName, DriverScoreDTO::getScore));

        double score1 = scoreMap.getOrDefault(driver1, 0.0);
        double score2 = scoreMap.getOrDefault(driver2, 0.0);

        String winner;

        if (score1 > score2) {
            winner = driver1;
        } else if (score2 > score1) {
            winner = driver2;
        } else {
            winner = "Tie";
        }

        return new DriverComparisonDTO(
                driver1,
                score1,
                driver2,
                score2,
                winner
        );
    }

    private double normalizeInverse(double value, double min, double max) {
        if (max - min == 0) return 1.0;
        return (max - value) / (max - min);
    }
}