package com.example.demo.controller;

import com.example.demo.dto.ImportRequest;
import com.example.demo.dto.WorkSearchResult;
import com.example.demo.model.User;
import com.example.demo.model.Work;
import com.example.demo.service.UserService;
import com.example.demo.service.WorkImportService;
import com.example.demo.service.WorkSearchService;
import com.example.demo.service.WorkService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/works")
public class WorkController {

    private final WorkService workService;
    private final WorkSearchService workSearchService;
    private final WorkImportService workImportService;
    private final UserService userService;

    public WorkController(WorkService workService,
                          WorkSearchService workSearchService,
                          WorkImportService workImportService,
                          UserService userService) {
        this.workService = workService;
        this.workSearchService = workSearchService;
        this.workImportService = workImportService;
        this.userService = userService;
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

    @PostMapping("/import")
    public ResponseEntity<Work> importWork(@Valid @RequestBody ImportRequest request,
                                           Authentication authentication) {
        if (!"jikan".equals(request.getSource())) {
            throw new RuntimeException("Source not supported: " + request.getSource());
        }

        String email = authentication.getName();
        User currentUser = userService.findByEmail(email);

        Work imported = workImportService.importFromJikan(request.getExternalId(), currentUser);
        return ResponseEntity.ok(imported);
    }
}