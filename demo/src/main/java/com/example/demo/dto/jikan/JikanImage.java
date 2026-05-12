package com.example.demo.dto.jikan;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class JikanImage {

    @JsonProperty("image_url")
    private String imageUrl;

    @JsonProperty("large_image_url")
    private String largeImageUrl;
}
