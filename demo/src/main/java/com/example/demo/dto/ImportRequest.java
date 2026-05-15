package com.example.demo.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ImportRequest {

    @Min(value = 1, message = "externalId must be positive")
    private int externalId;

    @NotBlank(message = "source is required")
    private String source;
}