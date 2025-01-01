package com.axora.backend.repository;

import com.axora.backend.entity.Category;
import com.axora.backend.entity.Task;
import com.axora.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedUser(User assignedUser);
    List<Task> findByCategory(Category category);
} 