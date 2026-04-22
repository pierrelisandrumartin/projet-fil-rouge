package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "works")
public class Work {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;
    private String synopsis;

    @Column(name = "cover_url")
    private String coverUrl;

    private String status;

    @Column(name = "total_volumes")
    private int totalVolumes;

    @Column(name = "total_chapters")
    private int totalChapters;

    @ManyToOne
    @JoinColumn(name = "category_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Category category;

    @ManyToOne
    @JoinColumn(name = "author_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Author author;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;
}