package com.example.demo.service;

import com.example.demo.client.JikanClient;
import com.example.demo.model.User;
import com.example.demo.model.Work;
import com.example.demo.repository.AuthorRepository;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProgressRepository;
import com.example.demo.repository.WorkRepository;
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
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WorkImportServiceTest {

    @Mock private JikanClient jikanClient;
    @Mock private WorkRepository workRepository;
    @Mock private AuthorRepository authorRepository;
    @Mock private CategoryRepository categoryRepository;
    @Mock private ProgressRepository progressRepository;

    @InjectMocks
    private WorkImportService workImportService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1);
    }

    @Test
    void importFromJikan_shouldReturnExistingWork_whenAlreadyImported() {
        Work existingWork = new Work();
        existingWork.setId(10);
        existingWork.setExternalId("42");
        existingWork.setSource("jikan");

        when(workRepository.findByExternalIdAndSource("42", "jikan"))
                .thenReturn(Optional.of(existingWork));
        when(progressRepository.existsByUserAndWork(user, existingWork))
                .thenReturn(true);

        Work result = workImportService.importFromJikan("42", user);

        assertThat(result).isEqualTo(existingWork);
        verify(jikanClient, never()).getMangaById(any(Integer.class));
        verify(progressRepository, never()).save(any());
    }

    @Test
    void importFromJikan_shouldThrow_whenMangaNotFoundOnJikan() {
        when(workRepository.findByExternalIdAndSource("999", "jikan"))
                .thenReturn(Optional.empty());
        when(jikanClient.getMangaById(999)).thenReturn(null);

        assertThatThrownBy(() -> workImportService.importFromJikan("999", user))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Manga not found");

        verify(workRepository, never()).save(any());
    }
}
