package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "authors")

public class Author {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
}
