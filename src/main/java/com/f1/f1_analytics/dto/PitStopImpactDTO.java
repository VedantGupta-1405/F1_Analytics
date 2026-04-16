package com.f1.f1_analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PitStopImpactDTO {
    private String driverName;
    private Double avgPitDuration;
}