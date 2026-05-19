package com.example.demo.dto;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class ProgressUpdateRequest {
    
    @Min (value = 0, message = "currentVolume must be positive")
    private int currentVolume;

    @Min (value = 0, message = "currentChapter must be positive")
    private int currentChapter;

    
}
