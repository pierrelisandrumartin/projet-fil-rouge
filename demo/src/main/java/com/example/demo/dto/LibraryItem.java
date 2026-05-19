package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LibraryItem {

    private int progressId;
    private int workId;
    private Integer externalId;
    private String source;
    private String title;
    private String synopsis;
    private String coverUrl;
    private String status;
    private String type;
    private int totalVolumes;
    private int totalChapters;
    private int currentVolume;
    private int currentChapter;
}
