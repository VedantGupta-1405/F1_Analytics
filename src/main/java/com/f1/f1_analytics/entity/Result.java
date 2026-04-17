package com.f1.f1_analytics.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "results",
       uniqueConstraints = @UniqueConstraint(columnNames = {"driver_id", "race_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Result {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // 🔗 MANY RESULTS → ONE DRIVER
    @ManyToOne
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    // 🔗 MANY RESULTS → ONE RACE
    @ManyToOne
    @JoinColumn(name = "race_id", nullable = false)
    private Race race;

    // 🔗 MANY RESULTS → ONE CONSTRUCTOR (we'll map later if needed)
    @Column(name = "constructor_id", nullable = false)
    private Integer constructorId;

    @Column(name = "grid_position")
    private Integer gridPosition;

    @Column(name = "finish_position")
    private Integer finishPosition;

    private Double points;

    private String status;

    @Column(name = "avg_lap_time")
    private Double avgLapTime;

    @Column(name = "lap_time_std_dev")
    private Double lapTimeStdDev;

    @Column(name = "position_gain")
    private Integer positionGain;
}