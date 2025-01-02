package com.axora.backend.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.axora.backend.entity.Category;
import com.axora.backend.entity.Task;
import com.axora.backend.entity.TaskStatus;
import com.axora.backend.entity.User;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedUser(User assignedUser);
    List<Task> findByCategory(Category category);
    List<Task> findByDueDateBeforeAndStatus(LocalDate date, TaskStatus status);
} 