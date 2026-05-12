package com.example.demo.dto.jikan;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class JikanImageContainer {
    
    private JikanImage jpg;
}
