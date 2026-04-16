package com.f1.f1_analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DecisionDTO {

    private String bestDriver;
    private double score;
    private String reason;
}