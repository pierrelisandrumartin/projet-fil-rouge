package com.example.demo.controller;

import com.example.demo.dto.WorkSearchResult;
import com.example.demo.model.Work;
import com.example.demo.service.WorkSearchService;
import com.example.demo.service.WorkService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/works")
public class WorkController {

    private final WorkService workService;
    private final WorkSearchService workSearchService;

    public WorkController(WorkService workService, WorkSearchService workSearchService) {
        this.workService = workService;
        this.workSearchService = workSearchService;
    }

    @GetMapping
    public List<Work> getAllWorks() {
        return workService.getAll();
    }

    @GetMapping("/{id}")
    public Work getById(@PathVariable int id) {
        return workService.getById(id);
    }

    @GetMapping("/search")
    public List<WorkSearchResult> search(@RequestParam("q") String query) {
        return workSearchService.search(query);
    }
}