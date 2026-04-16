package com.f1.f1_analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaceComparisonDTO {
    private String driverName;
    private Double avgLapTime;
}