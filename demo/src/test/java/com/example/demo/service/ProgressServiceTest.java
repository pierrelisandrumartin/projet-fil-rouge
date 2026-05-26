package com.example.demo.service;

import com.example.demo.dto.ProgressUpdateRequest;
import com.example.demo.exception.ForbiddenException;
import com.example.demo.model.Progress;
import com.example.demo.model.User;
import com.example.demo.repository.ProgressRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProgressServiceTest {

    @Mock
    private ProgressRepository progressRepository;

    @InjectMocks
    private ProgressService progressService;

    private User owner;
    private User intruder;
    private Progress existingProgress;

    @BeforeEach
    void setUp() {
        owner = new User();
        owner.setId(1);

        intruder = new User();
        intruder.setId(2);

        existingProgress = new Progress();
        existingProgress.setId(42);
        existingProgress.setUser(owner);
        existingProgress.setCurrentVolume(1);
        existingProgress.setCurrentChapter(1);
    }

    @Test
    void update_shouldSucceed_whenUserIsOwner() {
        ProgressUpdateRequest request = new ProgressUpdateRequest();
        request.setCurrentVolume(2);
        request.setCurrentChapter(15);

        when(progressRepository.findById(42)).thenReturn(Optional.of(existingProgress));
        when(progressRepository.save(any(Progress.class))).thenReturn(existingProgress);

        Progress result = progressService.update(42, request, owner);

        assertThat(result.getCurrentVolume()).isEqualTo(2);
        assertThat(result.getCurrentChapter()).isEqualTo(15);
        verify(progressRepository).save(existingProgress);
    }

    @Test
    void update_shouldThrowForbidden_whenUserIsNotOwner() {
        ProgressUpdateRequest request = new ProgressUpdateRequest();
        request.setCurrentVolume(99);
        request.setCurrentChapter(99);

        when(progressRepository.findById(42)).thenReturn(Optional.of(existingProgress));

        assertThatThrownBy(() -> progressService.update(42, request, intruder))
                .isInstanceOf(ForbiddenException.class);

        verify(progressRepository, never()).save(any());
    }

    @Test
    void delete_shouldThrowForbidden_whenUserIsNotOwner() {
        when(progressRepository.findById(42)).thenReturn(Optional.of(existingProgress));

        assertThatThrownBy(() -> progressService.delete(42, intruder))
                .isInstanceOf(ForbiddenException.class);

        verify(progressRepository, never()).deleteById(anyInt());
    }
}