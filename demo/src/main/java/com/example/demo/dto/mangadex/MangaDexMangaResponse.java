package com.example.demo.dto.mangadex;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class MangaDexMangaResponse {
    private MangaDexManga data;
}
