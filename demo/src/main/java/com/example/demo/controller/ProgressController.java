package com.example.demo.controller;

import com.example.demo.model.Progress;
import com.example.demo.service.ProgressService;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;
import jakarta.validation.Valid;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping
    public List<Progress> getAllProgress() {
        return progressService.getAll();
    }

    @GetMapping("/{id}")
    public Progress getById(@PathVariable int id) {
        return progressService.getById(id);
    }

    @PostMapping
    public Progress save(@Valid @RequestBody Progress progress) {
            log.debug("Creating progress for work: {}, user: {}", progress.getWork().getId(), progress.getUser().getId());
        return progressService.save(progress);
    }

    @PutMapping("/{id}")
    public Progress update(@PathVariable int id, @RequestBody Progress progress) {
            log.debug("Updating progress with id: {}", id);
        return progressService.update(id, progress);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        progressService.delete(id);
    }
}
