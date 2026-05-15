package com.example.demo.dto.jikan;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class JikanManga {

    @JsonProperty("mal_id")
    private int malId;

    private String title;

    @JsonProperty("title_english")
    private String titleEnglish;

    private String synopsis;

    private Integer chapters;

    private Integer volumes;

    private String status;

    private String type;

    private JikanImageContainer images;

    private List<JikanAuthor> authors;
}