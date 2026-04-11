package com.f1.f1_analytics.controller;

import com.f1.f1_analytics.dto.ResultDTO;
import com.f1.f1_analytics.dto.TopDriverDTO;
import com.f1.f1_analytics.service.ResultService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/results")
public class ResultController {

    private final ResultService resultService;

    public ResultController(ResultService resultService) {
        this.resultService = resultService;
    }

    // ✅ Existing: results by race
    @GetMapping("/race/{raceId}")
    public List<ResultDTO> getResultsByRace(@PathVariable Integer raceId) {
        return resultService.getResultsByRace(raceId);
    }

    // ✅ FIXED: Proper analytics DTO
    @GetMapping("/top-drivers")
    public List<TopDriverDTO> getTopDriversByWins() {
        return resultService.getTopDriversByWins();
    }
}