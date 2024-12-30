package com.axora.backend.repository;

import com.axora.backend.entity.Team;
import com.axora.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TeamRepository extends JpaRepository<Team, Long> {
    Optional<Team> findByName(String name);
    boolean existsByName(String name);
    List<Team> findByActiveTrue();
    
    @Query("SELECT t FROM Team t JOIN t.members m WHERE m = :user AND t.active = true")
    List<Team> findByMember(User user);
} 