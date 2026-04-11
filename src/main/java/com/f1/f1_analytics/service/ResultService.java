package com.f1.f1_analytics.service;

import com.f1.f1_analytics.dto.ResultDTO;
import com.f1.f1_analytics.dto.TopDriverDTO;
import com.f1.f1_analytics.repository.ResultRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResultService {

    private final ResultRepository resultRepository;

    public ResultService(ResultRepository resultRepository) {
        this.resultRepository = resultRepository;
    }

    // ✅ Existing: DTO mapping
    public List<ResultDTO> getResultsByRace(Integer raceId) {
        return resultRepository.findByRaceId(raceId)
                .stream()
                .map(result -> new ResultDTO(
                        result.getDriver().getFirstName() + " " + result.getDriver().getLastName(),
                        result.getRace().getName(),
                        result.getFinishPosition(),
                        result.getPoints()
                ))
                .collect(Collectors.toList());
    }

    // ✅ FIXED: Proper analytics DTO
    public List<TopDriverDTO> getTopDriversByWins() {
        return resultRepository.getTopDriversByWins()
                .stream()
                .map(obj -> new TopDriverDTO(
                        obj[0] + " " + obj[1],
                        (Long) obj[2]
                ))
                .toList();
    }
}