package com.axora.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.axora.backend.entity.Notification;
import com.axora.backend.entity.NotificationType;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // Kullanıcının tüm bildirimleri (en yeniden eskiye)
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    // Kullanıcının okunmamış bildirimleri
    List<Notification> findByUserIdAndReadFalseOrderByCreatedAtDesc(Long userId);
    
    // Okunmamış bildirim sayısı
    long countByUserIdAndReadFalse(Long userId);
    
    // Göreve ait bildirimler
    List<Notification> findByTaskIdOrderByCreatedAtDesc(Long taskId);
    
    // Kullanıcının belirli tipteki bildirimleri
    List<Notification> findByUserIdAndTypeOrderByCreatedAtDesc(Long userId, NotificationType type);
} 