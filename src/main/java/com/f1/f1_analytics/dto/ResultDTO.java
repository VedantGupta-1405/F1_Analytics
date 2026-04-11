package com.f1.f1_analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResultDTO {

    private String driverName;
    private String raceName;
    private Integer finishPosition;
    private Double points;
}