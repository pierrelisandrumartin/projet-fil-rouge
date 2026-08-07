package com.example.demo.dto.mangadex;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class MangaDexAttributes {
    private Map<String, String> title;        
    private Map<String, String> description;  
    private String status;                   
    private String lastVolume;               
    private String lastChapter;                
}