package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ImportRequest {

    @NotBlank(message = "externalId is required")
    private String externalId;

    @NotBlank(message = "source is required")
    private String source;
}
