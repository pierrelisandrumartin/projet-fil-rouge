package com.example.demo.client;

import com.example.demo.dto.jikan.JikanManga;
import com.example.demo.dto.jikan.JikanMangaResponse;
import com.example.demo.dto.jikan.JikanSearchResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;


@Component
public class JikanClient {

    private final RestClient jikanRestClient;

    public JikanClient(RestClient jikanRestClient) {
        this.jikanRestClient = jikanRestClient;
    }

    public JikanSearchResponse searchManga(String query) {
        return jikanRestClient.get()
                .uri("/manga?q={q}&limit=10&sfw=true&genres_exclude=9", query)
                .retrieve()
                .body(JikanSearchResponse.class);
    }
    public JikanSearchResponse getTopManga() {
    return jikanRestClient.get()
            .uri("/top/manga?limit=20&sfw=true&filter=bypopularity")
            .retrieve()
            .body(JikanSearchResponse.class);
}

    public JikanManga getMangaById(int id) {
        JikanMangaResponse response = jikanRestClient.get()
                .uri("/manga/{id}", id)
                .retrieve()
                .body(JikanMangaResponse.class);

        if (response == null || response.getData() == null) {
            return null;
        }
        return response.getData();
    }
}