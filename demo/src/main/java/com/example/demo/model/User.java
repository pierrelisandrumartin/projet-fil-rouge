package com.example.demo.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@Entity
@Table(name = "users")

public class User {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String username;
    private String email;
    @Column(name = "password_hash")
    private String passwordHash;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
