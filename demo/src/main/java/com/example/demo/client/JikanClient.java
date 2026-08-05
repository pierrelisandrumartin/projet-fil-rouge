package com.example.demo.client;

import com.example.demo.dto.jikan.JikanManga;
import com.example.demo.dto.jikan.JikanMangaResponse;
import com.example.demo.dto.jikan.JikanSearchResponse;
import com.example.demo.exception.ExternalApiUnavailableException;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Component
public class JikanClient {

    private final RestClient jikanRestClient;

    public JikanClient(RestClient jikanRestClient) {
        this.jikanRestClient = jikanRestClient;
    }

    public JikanSearchResponse searchManga(String query) {
        try {
            return jikanRestClient.get()
                    .uri("/manga?q={q}&limit=10&sfw=true&genres_exclude=9", query)
                    .retrieve()
                    .body(JikanSearchResponse.class);
        } catch (RestClientException e) {
            throw new ExternalApiUnavailableException(
                    "Jikan API is currently unavailable (search)", e);
        }
    }

    public JikanSearchResponse getTopManga() {
        try {
            return jikanRestClient.get()
                    .uri("/top/manga?limit=20&sfw=true&filter=bypopularity")
                    .retrieve()
                    .body(JikanSearchResponse.class);
        } catch (RestClientException e) {
            throw new ExternalApiUnavailableException(
                    "Jikan API is currently unavailable (trending)", e);
        }
    }

    public JikanManga getMangaById(int id) {
        try {
            JikanMangaResponse response = jikanRestClient.get()
                    .uri("/manga/{id}", id)
                    .retrieve()
                    .body(JikanMangaResponse.class);

            if (response == null || response.getData() == null) {
                return null;
            }
            return response.getData();
        } catch (RestClientException e) {
            throw new ExternalApiUnavailableException(
                    "Jikan API is currently unavailable (import id=" + id + ")", e);
        }
    }
}