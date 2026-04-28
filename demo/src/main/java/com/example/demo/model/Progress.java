package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import lombok.Data;
import org.hibernate.annotations.UpdateTimestamp;

@Data
@Entity
@Table(name = "progress")
public class Progress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotNull(message = "User is required")
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private User user;

    @NotNull(message = "Work is required")
    @ManyToOne
    @JoinColumn(name = "work_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Work work;

    @Min(value = 0, message = "currentVol")
    @Column(name = "current_volume")
    private int currentVolume;

    @Min(value = 0, message = "currentChapter must be positive")
    @Column(name = "current_chapter")
    private int currentChapter;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}