package com.example.demo.controller;

import com.example.demo.entity.HazardData;
import com.example.demo.service.HazardDataService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/hazarddata")
public class HazardDataController {

    private final HazardDataService hazardDataService;

    public HazardDataController(HazardDataService hazardDataService) {
        this.hazardDataService = hazardDataService;
    }

    @GetMapping
    public List<HazardData> getAllHazardData() {
        return hazardDataService.getAllHazardData();
    }
}
