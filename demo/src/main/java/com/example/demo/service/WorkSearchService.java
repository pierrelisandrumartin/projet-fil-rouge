package com.example.demo.service;

import com.example.demo.client.JikanClient;
import com.example.demo.dto.WorkSearchResult;
import com.example.demo.dto.jikan.JikanManga;
import com.example.demo.dto.jikan.JikanSearchResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkSearchService {

    private final JikanClient jikanClient;

    public WorkSearchService(JikanClient jikanClient) {
        this.jikanClient = jikanClient;
    }

    public List<WorkSearchResult> search(String query) {
        JikanSearchResponse response = jikanClient.searchManga(query);

        if (response == null || response.getData() == null) {
            return List.of();
        }

        return response.getData().stream()
                .map(this::toSearchResult)
                .collect(Collectors.toList());
    }

    public List<WorkSearchResult> getTrending() {
    JikanSearchResponse response = jikanClient.getTopManga();

    if (response == null || response.getData() == null) {
        return List.of();
    }

    return response.getData().stream()
            .map(this::toSearchResult)
            .collect(Collectors.toList());
}

    private WorkSearchResult toSearchResult(JikanManga manga) {
        String coverUrl = null;
        if (manga.getImages() != null && manga.getImages().getJpg() != null) {
            coverUrl = manga.getImages().getJpg().getLargeImageUrl();
        }

        return new WorkSearchResult(
                manga.getMalId(),
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
}