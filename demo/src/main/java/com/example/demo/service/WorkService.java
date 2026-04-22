package com.example.demo.service;

import com.example.demo.model.Work;
import com.example.demo.repository.WorkRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkService {

    private final WorkRepository workRepository;

    public WorkService(WorkRepository workRepository) {
        this.workRepository = workRepository;
    }

    public List<Work> getAll() {
        return workRepository.findAll();
    }

    public Work getById(int id) {
    Work work = workRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Work not found"));
    
    return work;
}
    }
    
