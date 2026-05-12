package com.example.demo.dto.jikan;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class JikanSearchResponse {

    private List<JikanManga> data;
}
