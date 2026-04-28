package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
@Entity
@Table(name = "works")
public class Work {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;


    @NotBlank(message = "Title is required")
    @Size(min = 1, max = 50, message = "Title must be between 1 and 50 characters")
    private String title;

    @NotBlank(message = "Synopsis is required")
    private String synopsis;

    @NotBlank(message = "Cover URL is required")
    @Column(name = "cover_url")
    private String coverUrl;

    @NotBlank(message = "Status is required")
    private String status;

    @Min(value = 0, message = "totalVolumes must be positive")
    @Column(name = "total_volumes")
    private int totalVolumes;

    @Min(value = 0, message = "totalChapters must be positive")
    @Column(name = "total_chapters")
    private int totalChapters;

    @NotNull(message = "Category is required")
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @NotNull(message = "Author is required")
    @ManyToOne
    @JoinColumn(name = "author_id")
    private Author author;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;
}