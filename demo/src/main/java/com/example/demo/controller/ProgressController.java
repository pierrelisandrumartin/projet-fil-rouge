package com.example.demo.controller;

import com.example.demo.dto.ProgressUpdateRequest;
import com.example.demo.model.Progress;
import com.example.demo.model.User;
import com.example.demo.service.ProgressService;
import com.example.demo.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;
import jakarta.validation.Valid;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final ProgressService progressService;
    private final UserService userService;

    public ProgressController(ProgressService progressService, UserService userService) {
        this.progressService = progressService;
        this.userService = userService;
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
        log.debug("Creating progress for work: {}, user: {}",
                progress.getWork().getId(), progress.getUser().getId());
        return progressService.save(progress);
    }

    @PutMapping("/{id}")
    public Progress update(@PathVariable int id,
                           @Valid @RequestBody ProgressUpdateRequest request,
                           Authentication authentication) {
        String email = authentication.getName();
        User currentUser = userService.findByEmail(email);
        return progressService.update(id, request, currentUser);
    }

    @DeleteMapping("/{id}")
public ResponseEntity<Void> delete(@PathVariable int id, Authentication authentication) {
    String email = authentication.getName();
    User currentUser = userService.findByEmail(email);
    progressService.delete(id, currentUser);
    return ResponseEntity.noContent().build();
}
}