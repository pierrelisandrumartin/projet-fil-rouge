package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkSearchResult {
    
    private int externalId;
    private String source;
    private String title;
    private String titleEnglish;
    private String synopsis;
    private Integer chapters;
    private Integer volumes;
    private String status;
    private String type;
    private String coverUrl;
}
