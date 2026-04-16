package com.f1.f1_analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DriverComparisonDTO {

    private String driver1;
    private double driver1Score;

    private String driver2;
    private double driver2Score;

    private String winner;
}