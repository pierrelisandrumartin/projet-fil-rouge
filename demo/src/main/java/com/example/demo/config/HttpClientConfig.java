package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class HttpClientConfig {
    
    @Bean
    public RestClient jikanRestClient() {
        return RestClient.builder()
                .baseUrl("https://api.jikan.moe/v4")
                .build();
    }

    @Bean 
    public RestClient mangaDexRestClient() {
        return RestClient.builder()
            .baseUrl("https://api.mangadex.org")
            .defaultHeader("User-Agent", "Yomi/1.0")
            .build();
    }
}
