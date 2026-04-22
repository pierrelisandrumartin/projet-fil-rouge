package com.example.demo.controller;

import com.example.demo.model.Work;
import com.example.demo.service.WorkService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/works")
public class WorkController {

    private final WorkService workService;

    public WorkController (WorkService workService) {
        this.workService = workService;
    }

    @GetMapping
public List<Work> getAllWorks() {
    return workService.getAll();
}
   @GetMapping("/{id}")
public Work getById (@PathVariable int id) {
    return workService.getById(id);
}
}
