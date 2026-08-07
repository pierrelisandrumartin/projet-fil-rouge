package com.example.demo.service;

import com.example.demo.client.JikanClient;
import com.example.demo.client.MangaDexClient;
import com.example.demo.dto.jikan.JikanAuthor;
import com.example.demo.dto.jikan.JikanImage;
import com.example.demo.dto.jikan.JikanImageContainer;
import com.example.demo.dto.jikan.JikanManga;
import com.example.demo.dto.mangadex.MangaDexManga;
import com.example.demo.dto.mangadex.MangaDexRelationship;
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
import java.util.Map;

@Service
public class WorkImportService {

    private static final String SOURCE_JIKAN = "jikan";
    private static final String SOURCE_MANGADEX = "mangadex";
    private static final String DEFAULT_COVER = "https://via.placeholder.com/200x280?text=No+Cover";

    private final JikanClient jikanClient;
    private final MangaDexClient mangaDexClient;
    private final WorkRepository workRepository;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;
    private final ProgressRepository progressRepository;

    public WorkImportService(JikanClient jikanClient,
                             MangaDexClient mangaDexClient,
                             WorkRepository workRepository,
                             AuthorRepository authorRepository,
                             CategoryRepository categoryRepository,
                             ProgressRepository progressRepository) {
        this.jikanClient = jikanClient;
        this.mangaDexClient = mangaDexClient;
        this.workRepository = workRepository;
        this.authorRepository = authorRepository;
        this.categoryRepository = categoryRepository;
        this.progressRepository = progressRepository;
    }

    // ── Jikan import ─────────────────────────────────────────────────────

    @Transactional
    public Work importFromJikan(String externalId, User currentUser) {
        Work work = workRepository.findByExternalIdAndSource(externalId, SOURCE_JIKAN)
                .orElseGet(() -> createWorkFromJikan(externalId));

        if (!progressRepository.existsByUserAndWork(currentUser, work)) {
            createInitialProgress(currentUser, work);
        }

        return work;
    }

    private Work createWorkFromJikan(String externalId) {
        int jikanId;
        try {
            jikanId = Integer.parseInt(externalId);
        } catch (NumberFormatException e) {
            throw new RuntimeException("Invalid Jikan id: " + externalId);
        }

        JikanManga manga = jikanClient.getMangaById(jikanId);
        if (manga == null) {
            throw new RuntimeException("Manga not found on Jikan");
        }

        Author author = findOrCreateAuthor(extractJikanAuthorName(manga.getAuthors()));
        Category category = findOrCreateCategory(manga.getType());

        Work work = new Work();
        work.setExternalId(String.valueOf(manga.getMalId()));
        work.setSource(SOURCE_JIKAN);
        work.setTitle(truncate(safe(manga.getTitle(), "Untitled"), 255));
        work.setSynopsis(safe(manga.getSynopsis(), "No synopsis available"));
        work.setCoverUrl(extractJikanCoverUrl(manga));
        work.setStatus(safe(manga.getStatus(), "Unknown"));
        work.setTotalVolumes(nullSafe(manga.getVolumes()));
        work.setTotalChapters(nullSafe(manga.getChapters()));
        work.setAuthor(author);
        work.setCategory(category);
        work.setCreatedAt(LocalDateTime.now());

        return workRepository.save(work);
    }

    private String extractJikanAuthorName(List<JikanAuthor> jikanAuthors) {
        if (jikanAuthors == null || jikanAuthors.isEmpty()) return "Unknown";
        return jikanAuthors.get(0).getName();
    }

    private String extractJikanCoverUrl(JikanManga manga) {
        JikanImageContainer images = manga.getImages();
        if (images == null || images.getJpg() == null) {
            return DEFAULT_COVER;
        }
        JikanImage jpg = images.getJpg();
        return safe(jpg.getLargeImageUrl(), DEFAULT_COVER);
    }

    // ── MangaDex import ──────────────────────────────────────────────────

    @Transactional
    public Work importFromMangaDex(String externalId, User currentUser) {
        Work work = workRepository.findByExternalIdAndSource(externalId, SOURCE_MANGADEX)
                .orElseGet(() -> createWorkFromMangaDex(externalId));

        if (!progressRepository.existsByUserAndWork(currentUser, work)) {
            createInitialProgress(currentUser, work);
        }

        return work;
    }

    private Work createWorkFromMangaDex(String externalId) {
        MangaDexManga manga = mangaDexClient.getMangaById(externalId);
        if (manga == null) {
            throw new RuntimeException("Manga not found on MangaDex");
        }

        var attrs = manga.getAttributes();
        String title = truncate(pickLocalized(attrs != null ? attrs.getTitle() : null, "Untitled"), 255);
        String synopsis = pickLocalized(attrs != null ? attrs.getDescription() : null, "No synopsis available");
        String status = safe(attrs != null ? attrs.getStatus() : null, "Unknown");
        Integer chapters = parseIntSafe(attrs != null ? attrs.getLastChapter() : null);
        Integer volumes = parseIntSafe(attrs != null ? attrs.getLastVolume() : null);

        Author author = findOrCreateAuthor(extractMangaDexAuthorName(manga));
        Category category = findOrCreateCategory("Manga");

        Work work = new Work();
        work.setExternalId(manga.getId());
        work.setSource(SOURCE_MANGADEX);
        work.setTitle(title);
        work.setSynopsis(synopsis);
        work.setCoverUrl(extractMangaDexCoverUrl(manga));
        work.setStatus(status);
        work.setTotalVolumes(nullSafe(volumes));
        work.setTotalChapters(nullSafe(chapters));
        work.setAuthor(author);
        work.setCategory(category);
        work.setCreatedAt(LocalDateTime.now());

        return workRepository.save(work);
    }

    private String extractMangaDexAuthorName(MangaDexManga manga) {
        if (manga.getRelationships() == null) return "Unknown";
        for (MangaDexRelationship rel : manga.getRelationships()) {
            if ("author".equals(rel.getType())
                    && rel.getAttributes() != null
                    && rel.getAttributes().getName() != null) {
                return rel.getAttributes().getName();
            }
        }
        return "Unknown";
    }

    private String extractMangaDexCoverUrl(MangaDexManga manga) {
        if (manga.getRelationships() == null) return DEFAULT_COVER;
        for (MangaDexRelationship rel : manga.getRelationships()) {
            if ("cover_art".equals(rel.getType())
                    && rel.getAttributes() != null
                    && rel.getAttributes().getFileName() != null) {
                return "https://uploads.mangadex.org/covers/"
                        + manga.getId() + "/"
                        + rel.getAttributes().getFileName() + ".512.jpg";
            }
        }
        return DEFAULT_COVER;
    }

    private String pickLocalized(Map<String, String> localized, String fallback) {
        if (localized == null || localized.isEmpty()) return fallback;
        if (localized.containsKey("en")) return localized.get("en");
        return localized.values().iterator().next();
    }

    private Integer parseIntSafe(String s) {
        if (s == null || s.isBlank()) return null;
        try {
            return Integer.parseInt(s.split("\\.")[0]);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    // ── Shared ────────────────────────────────────────────────────────────

    private void createInitialProgress(User user, Work work) {
        Progress progress = new Progress();
        progress.setUser(user);
        progress.setWork(work);
        progress.setCurrentVolume(0);
        progress.setCurrentChapter(0);
        progressRepository.save(progress);
    }

    private Author findOrCreateAuthor(String name) {
        String safeName = safe(name, "Unknown");
        return authorRepository.findByName(safeName)
                .orElseGet(() -> {
                    Author a = new Author();
                    a.setName(safeName);
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
