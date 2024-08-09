package com.example.demo.service;

import com.example.demo.entity.HazardData;
import com.example.demo.repository.HazardDataRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HazardDataService {

    private final HazardDataRepository hazardDataRepository;

    public HazardDataService(HazardDataRepository hazardDataRepository) {
        this.hazardDataRepository = hazardDataRepository;
    }

    public List<HazardData> getAllHazardData() {
        return hazardDataRepository.findAll();
    }
}
