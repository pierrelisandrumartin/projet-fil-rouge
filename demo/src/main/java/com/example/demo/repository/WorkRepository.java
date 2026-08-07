package com.example.demo.repository;


import com.example.demo.model.Work;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WorkRepository extends JpaRepository<Work, Integer> {
    Optional<Work> findByExternalIdAndSource(String externalId, String source);
    
} 