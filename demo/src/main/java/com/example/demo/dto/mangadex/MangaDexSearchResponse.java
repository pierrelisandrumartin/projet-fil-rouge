package com.example.demo.dto.mangadex;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class MangaDexSearchResponse {
    private List<MangaDexManga> data;
}
