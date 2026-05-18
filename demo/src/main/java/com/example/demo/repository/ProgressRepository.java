package com.example.demo.repository;

import com.example.demo.model.Progress;
import com.example.demo.model.User;
import com.example.demo.model.Work;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, Integer> {

    boolean existsByUserAndWork(User user, Work work);

    List<Progress> findByUser(User user);
}