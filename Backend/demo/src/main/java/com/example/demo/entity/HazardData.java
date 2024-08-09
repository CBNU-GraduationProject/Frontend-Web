package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "hazarddata")
public class HazardData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long hid;

    @Column(name = "hazardtype", nullable = false)
    private String hazardType;

    @Column(name = "사진")
    private String photo;

    @Column(name = "gps")
    private String gps;

    @Column(name = "state")
    private String state;

    @Column(name = "dates", updatable = false)
    private LocalDateTime dates;

}
