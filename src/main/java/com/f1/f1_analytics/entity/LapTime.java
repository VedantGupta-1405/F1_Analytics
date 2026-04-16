package com.f1.f1_analytics.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lap_times")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LapTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "race_id")
    private Race race;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @Column(name = "lap_number")
    private Integer lapNumber;

    @Column(name = "lap_time")
    private Double lapTime;
}