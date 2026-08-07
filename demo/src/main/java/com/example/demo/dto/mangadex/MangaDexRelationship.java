package com.example.demo.dto.mangadex;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class MangaDexRelationship {
    private String id;
    private String type;
    private MangaDexRelationshipAttributes attributes; 
}
