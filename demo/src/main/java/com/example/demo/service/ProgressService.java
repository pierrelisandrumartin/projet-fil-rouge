package com.example.demo.service;

import com.example.demo.dto.LibraryItem;
import com.example.demo.dto.ProgressUpdateRequest;
import com.example.demo.exception.ForbiddenException;
import com.example.demo.model.Progress;
import com.example.demo.model.User;
import com.example.demo.model.Work;
import com.example.demo.repository.ProgressRepository;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ProgressService {

    private final ProgressRepository progressRepository;

    public ProgressService(ProgressRepository progressRepository) {
        this.progressRepository = progressRepository;
    }

    public List<Progress> getAll() {
        log.info("Fetching all progress records");
        return progressRepository.findAll();
    }

    public Progress getById(int id) {
        log.debug("Fetching progress with id: {}", id);
        return progressRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Progress not found with id: {}", id);
                    return new RuntimeException("Progress not found");
                });
    }

    public Progress save(Progress progress) {
        log.info("Saving progress for user: {}, and work: {}",
                progress.getUser().getId(), progress.getWork().getId());
        return progressRepository.save(progress);
    }

    public void delete(int id) {
        log.info("Deleting progress with id: {}", id);
        progressRepository.deleteById(id);
    }

    public Progress update(int id, ProgressUpdateRequest request, User currentUser) {
        log.debug("Updating progress with id: {} for user: {}", id, currentUser.getId());

        Progress existing = progressRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Progress not found for update with id: {}", id);
                    return new RuntimeException("Progress not found");
                });

        if (existing.getUser().getId() != currentUser.getId()) {
            log.warn("User {} tried to modify progress {} that doesn't belong to them",
                    currentUser.getId(), id);
            throw new ForbiddenException();
        }

        existing.setCurrentVolume(request.getCurrentVolume());
        existing.setCurrentChapter(request.getCurrentChapter());
        return progressRepository.save(existing);
    }

    public List<LibraryItem> getUserLibrary(User user) {
        log.debug("Fetching library for user: {}", user.getId());
        return progressRepository.findByUser(user).stream()
                .map(this::toLibraryItem)
                .collect(Collectors.toList());
    }

    private LibraryItem toLibraryItem(Progress progress) {
        Work work = progress.getWork();
        String categoryName = (work.getCategory() != null) ? work.getCategory().getName() : "Unknown";

        return new LibraryItem(
                progress.getId(),
                work.getId(),
                work.getExternalId(),
                work.getSource(),
                work.getTitle(),
                work.getSynopsis(),
                work.getCoverUrl(),
                work.getStatus(),
                categoryName,
                work.getTotalVolumes(),
                work.getTotalChapters(),
                progress.getCurrentVolume(),
                progress.getCurrentChapter()
        );
    }
}