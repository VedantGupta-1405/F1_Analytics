package com.f1.f1_analytics.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pit_stops")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PitStop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "race_id")
    private Race race;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    private Integer lap;
    private Double duration;
}