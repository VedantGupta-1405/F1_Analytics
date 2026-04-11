package com.f1.f1_analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TopDriverDTO {

    private String driverName;
    private Long wins;
}