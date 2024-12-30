package com.axora.backend.entity;

public enum TaskPriority {
    LOW("Düşük"),
    MEDIUM("Orta"),
    HIGH("Yüksek");

    private final String displayName;

    TaskPriority(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
} 