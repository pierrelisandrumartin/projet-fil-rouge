package com.example.demo.service;

import com.example.demo.client.JikanClient;
import com.example.demo.client.MangaDexClient;
import com.example.demo.dto.WorkSearchResult;
import com.example.demo.dto.jikan.JikanManga;
import com.example.demo.dto.jikan.JikanSearchResponse;
import com.example.demo.dto.mangadex.MangaDexManga;
import com.example.demo.dto.mangadex.MangaDexRelationship;
import com.example.demo.dto.mangadex.MangaDexSearchResponse;
import com.example.demo.exception.ExternalApiUnavailableException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
public class WorkSearchService {

    private final JikanClient jikanClient;
    private final MangaDexClient mangaDexClient;

    public WorkSearchService(JikanClient jikanClient, MangaDexClient mangaDexClient) {
        this.jikanClient = jikanClient;
        this.mangaDexClient = mangaDexClient;
    }

    public List<WorkSearchResult> search(String query) {
        try {
            JikanSearchResponse response = jikanClient.searchManga(query);
            return mapJikan(response);
        } catch (ExternalApiUnavailableException jikanError) {
            log.warn("Jikan search unavailable, falling back to MangaDex: {}", jikanError.getMessage());
            MangaDexSearchResponse response = mangaDexClient.searchManga(query);
            return mapMangaDex(response);
        }
    }

    public List<WorkSearchResult> getTrending() {
        try {
            JikanSearchResponse response = jikanClient.getTopManga();
            return mapJikan(response);
        } catch (ExternalApiUnavailableException jikanError) {
            log.warn("Jikan trending unavailable, falling back to MangaDex: {}", jikanError.getMessage());
            MangaDexSearchResponse response = mangaDexClient.getTopManga();
            return mapMangaDex(response);
        }
    }

    // ── Jikan mapping ─────────────────────────────────────────────────────

    private List<WorkSearchResult> mapJikan(JikanSearchResponse response) {
        if (response == null || response.getData() == null) {
            return List.of();
        }
        return response.getData().stream()
                .map(this::toSearchResultFromJikan)
                .collect(Collectors.toList());
    }

    private WorkSearchResult toSearchResultFromJikan(JikanManga manga) {
        String coverUrl = null;
        if (manga.getImages() != null && manga.getImages().getJpg() != null) {
            coverUrl = manga.getImages().getJpg().getLargeImageUrl();
        }

        return new WorkSearchResult(
                manga.getMalId(),
                null,
                "jikan",
                manga.getTitle(),
                manga.getTitleEnglish(),
                manga.getSynopsis(),
                manga.getChapters(),
                manga.getVolumes(),
                manga.getStatus(),
                manga.getType(),
                coverUrl
        );
    }

    // ── MangaDex mapping ──────────────────────────────────────────────────

    private List<WorkSearchResult> mapMangaDex(MangaDexSearchResponse response) {
        if (response == null || response.getData() == null) {
            return List.of();
        }
        return response.getData().stream()
                .map(this::toSearchResultFromMangaDex)
                .collect(Collectors.toList());
    }

    private WorkSearchResult toSearchResultFromMangaDex(MangaDexManga manga) {
        String title = pickLocalized(manga.getAttributes() != null ? manga.getAttributes().getTitle() : null, "Untitled");
        String synopsis = pickLocalized(manga.getAttributes() != null ? manga.getAttributes().getDescription() : null, "");
        String status = (manga.getAttributes() != null) ? manga.getAttributes().getStatus() : null;
        Integer chapters = parseIntSafe(manga.getAttributes() != null ? manga.getAttributes().getLastChapter() : null);
        Integer volumes = parseIntSafe(manga.getAttributes() != null ? manga.getAttributes().getLastVolume() : null);
        String coverUrl = buildCoverUrl(manga);

        return new WorkSearchResult(
                null,
                manga.getId(),
                "mangadex",
                title,
                null,
                synopsis,
                chapters,
                volumes,
                status,
                "Manga",
                coverUrl
        );
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

    private String buildCoverUrl(MangaDexManga manga) {
        if (manga.getRelationships() == null) return null;
        for (MangaDexRelationship rel : manga.getRelationships()) {
            if ("cover_art".equals(rel.getType())
                    && rel.getAttributes() != null
                    && rel.getAttributes().getFileName() != null) {
                return "https://uploads.mangadex.org/covers/"
                        + manga.getId() + "/"
                        + rel.getAttributes().getFileName() + ".256.jpg";
            }
        }
        return null;
    }
}