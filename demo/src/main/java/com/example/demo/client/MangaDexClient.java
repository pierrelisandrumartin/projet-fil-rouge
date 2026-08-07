package com.example.demo.client;

import com.example.demo.dto.mangadex.MangaDexManga;
import com.example.demo.dto.mangadex.MangaDexMangaResponse;
import com.example.demo.dto.mangadex.MangaDexSearchResponse;
import com.example.demo.exception.ExternalApiUnavailableException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Component
public class MangaDexClient {

    private final RestClient mangaDexRestClient;

    public MangaDexClient(@Qualifier("mangaDexRestClient") RestClient mangaDexRestClient) {
        this.mangaDexRestClient = mangaDexRestClient;
    }

    public MangaDexSearchResponse searchManga(String query) {
        try {
            return mangaDexRestClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/manga")
                            .queryParam("title", query)
                            .queryParam("limit", 10)
                            .queryParam("contentRating[]", "safe", "suggestive")
                            .queryParam("includes[]", "cover_art")
                            .build())
                    .retrieve()
                    .body(MangaDexSearchResponse.class);
        } catch (RestClientException e) {
            throw new ExternalApiUnavailableException(
                    "MangaDex API is currently unavailable (search)", e);
        }
    }

    public MangaDexSearchResponse getTopManga() {
        try {
            return mangaDexRestClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/manga")
                            .queryParam("order[followedCount]", "desc")
                            .queryParam("limit", 20)
                            .queryParam("contentRating[]", "safe", "suggestive")
                            .queryParam("includes[]", "cover_art")
                            .build())
                    .retrieve()
                    .body(MangaDexSearchResponse.class);
        } catch (RestClientException e) {
            throw new ExternalApiUnavailableException(
                    "MangaDex API is currently unavailable (trending)", e);
        }
    }

    public MangaDexManga getMangaById(String id) {
        try {
            MangaDexMangaResponse response = mangaDexRestClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/manga/{id}")
                            .queryParam("includes[]", "cover_art", "author")
                            .build(id))
                    .retrieve()
                    .body(MangaDexMangaResponse.class);

            if (response == null || response.getData() == null) {
                return null;
            }
            return response.getData();
        } catch (RestClientException e) {
            throw new ExternalApiUnavailableException(
                    "MangaDex API is currently unavailable (import id=" + id + ")", e);
        }
    }
}
