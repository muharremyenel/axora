package com.axora.backend.entity;

public enum NotificationType {
    TASK_ASSIGNED,        // Görev atandığında (user)
    TASK_STATUS_CHANGED,  // Görev durumu değiştiğinde (admin & user)
    TASK_COMMENTED,       // Yorum eklendiğinde (admin & user)
    TASK_OVERDUE         // Görev süresi geçtiğinde (admin & user)
} 