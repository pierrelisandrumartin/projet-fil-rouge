package com.example.demo.service;

import com.example.demo.client.JikanClient;
import com.example.demo.dto.jikan.JikanAuthor;
import com.example.demo.dto.jikan.JikanImage;
import com.example.demo.dto.jikan.JikanImageContainer;
import com.example.demo.dto.jikan.JikanManga;
import com.example.demo.model.Author;
import com.example.demo.model.Category;
import com.example.demo.model.Progress;
import com.example.demo.model.User;
import com.example.demo.model.Work;
import com.example.demo.repository.AuthorRepository;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProgressRepository;
import com.example.demo.repository.WorkRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WorkImportService {

    private static final String SOURCE_JIKAN = "jikan";
    private static final String DEFAULT_COVER = "https://via.placeholder.com/200x280?text=No+Cover";

    private final JikanClient jikanClient;
    private final WorkRepository workRepository;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;
    private final ProgressRepository progressRepository;

    public WorkImportService(JikanClient jikanClient,
                             WorkRepository workRepository,
                             AuthorRepository authorRepository,
                             CategoryRepository categoryRepository,
                             ProgressRepository progressRepository) {
        this.jikanClient = jikanClient;
        this.workRepository = workRepository;
        this.authorRepository = authorRepository;
        this.categoryRepository = categoryRepository;
        this.progressRepository = progressRepository;
    }

    @Transactional
    public Work importFromJikan(int externalId, User currentUser) {
        Work work = workRepository.findByExternalIdAndSource(externalId, SOURCE_JIKAN)
                .orElseGet(() -> createWorkFromJikan(externalId));

        if (!progressRepository.existsByUserAndWork(currentUser, work)) {
            createInitialProgress(currentUser, work);
        }

        return work;
    }

    private Work createWorkFromJikan(int externalId) {
        JikanManga manga = jikanClient.getMangaById(externalId);
        if (manga == null) {
            throw new RuntimeException("Manga not found on Jikan");
        }

        Author author = findOrCreateAuthor(manga.getAuthors());
        Category category = findOrCreateCategory(manga.getType());

        Work work = new Work();
        work.setExternalId(manga.getMalId());
        work.setSource(SOURCE_JIKAN);
        work.setTitle(truncate(safe(manga.getTitle(), "Untitled"), 255));
        work.setSynopsis(safe(manga.getSynopsis(), "No synopsis available"));
        work.setCoverUrl(extractCoverUrl(manga));
        work.setStatus(safe(manga.getStatus(), "Unknown"));
        work.setTotalVolumes(nullSafe(manga.getVolumes()));
        work.setTotalChapters(nullSafe(manga.getChapters()));
        work.setAuthor(author);
        work.setCategory(category);
        work.setCreatedAt(LocalDateTime.now());

        return workRepository.save(work);
    }

    private void createInitialProgress(User user, Work work) {
        Progress progress = new Progress();
        progress.setUser(user);
        progress.setWork(work);
        progress.setCurrentVolume(0);
        progress.setCurrentChapter(0);
        progressRepository.save(progress);
    }

    private Author findOrCreateAuthor(List<JikanAuthor> jikanAuthors) {
        String name = (jikanAuthors == null || jikanAuthors.isEmpty())
                ? "Unknown"
                : jikanAuthors.get(0).getName();

        return authorRepository.findByName(name)
                .orElseGet(() -> {
                    Author a = new Author();
                    a.setName(name);
                    return authorRepository.save(a);
                });
    }

    private Category findOrCreateCategory(String type) {
        String name = safe(type, "Unknown");

        return categoryRepository.findByName(name)
                .orElseGet(() -> {
                    Category c = new Category();
                    c.setName(name);
                    return categoryRepository.save(c);
                });
    }

    private String extractCoverUrl(JikanManga manga) {
        JikanImageContainer images = manga.getImages();
        if (images == null || images.getJpg() == null) {
            return DEFAULT_COVER;
        }
        JikanImage jpg = images.getJpg();
        return safe(jpg.getLargeImageUrl(), DEFAULT_COVER);
    }

    private String safe(String s, String fallback) {
        return (s == null || s.isBlank()) ? fallback : s;
    }

    private int nullSafe(Integer i) {
        return i != null ? i : 0;
    }

    private String truncate(String s, int maxLen) {
        return s.length() <= maxLen ? s : s.substring(0, maxLen);
    }
}
