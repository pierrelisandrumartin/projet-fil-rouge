package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "works")

public class Work {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;
    private String synopsis;
    private String coverUrl;
    private String status;
    private int totalVolumes;
    private int totalChapters;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private Author author;

    private java.time.LocalDateTime createdAt;
}
