package com.example.demo.client;

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
                .uri("/manga?q={q}&limit=10", query)
                .retrieve()
                .body(JikanSearchResponse.class);
    }
}
