package com.axora.backend.scheduler;

import java.time.LocalDate;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.axora.backend.entity.Task;
import com.axora.backend.entity.NotificationType;
import com.axora.backend.repository.TaskRepository;
import com.axora.backend.service.NotificationService;
import com.axora.backend.entity.TaskStatus;
import com.axora.backend.entity.Role;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class TaskScheduler {
    private final TaskRepository taskRepository;
    private final NotificationService notificationService;

    @Scheduled(cron = "0 0 9 * * *") // Her gün saat 09:00'da çalışır
    public void checkOverdueTasks() {
        List<Task> overdueTasks = taskRepository.findByDueDateBeforeAndStatus(
            LocalDate.now(), 
            TaskStatus.TODO
        );

        for (Task task : overdueTasks) {
            notificationService.createNotification(
                task.getAssignedUser(),
                task,
                "Geciken Görev",
                String.format("%s görevi için son tarih geçti!", task.getTitle()),
                NotificationType.TASK_OVERDUE
            );

            if (task.getCreatedBy().getRole().equals(Role.ROLE_ADMIN)) {
                notificationService.createNotification(
                    task.getCreatedBy(),
                    task,
                    "Geciken Görev",
                    String.format("%s görevi için son tarih geçti!", task.getTitle()),
                    NotificationType.TASK_OVERDUE
                );
            }
        }
    }
} 