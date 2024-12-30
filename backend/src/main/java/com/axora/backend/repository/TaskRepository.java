package com.axora.backend.repository;

import com.axora.backend.entity.Task;
import com.axora.backend.entity.TaskPriority;
import com.axora.backend.entity.TaskStatus;
import com.axora.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    Page<Task> findByAssignedUser(User user, Pageable pageable);
    List<Task> findByStatusAndDueDateBefore(TaskStatus status, LocalDateTime date);
    
    @Query("SELECT t FROM Task t WHERE " +
           "(:status is null OR t.status = :status) AND " +
           "(:priority is null OR t.priority = :priority) AND " +
           "(:categoryId is null OR t.category.id = :categoryId) AND " +
           "(:assignedUserId is null OR t.assignedUser.id = :assignedUserId) AND " +
           "(:dueDateStart is null OR t.dueDate >= :dueDateStart) AND " +
           "(:dueDateEnd is null OR t.dueDate <= :dueDateEnd)")
    Page<Task> findByFilters(
            @Param("status") TaskStatus status,
            @Param("priority") TaskPriority priority,
            @Param("categoryId") Long categoryId,
            @Param("assignedUserId") Long assignedUserId,
            @Param("dueDateStart") LocalDateTime dueDateStart,
            @Param("dueDateEnd") LocalDateTime dueDateEnd,
            Pageable pageable);
    
    long countByAssignedUserAndStatus(User user, TaskStatus status);
} 