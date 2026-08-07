package com.example.demo.dto.mangadex;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class MangaDexManga {
    private String id;
    private MangaDexAttributes attributes;
    private List<MangaDexRelationship> relationships;
    
}
