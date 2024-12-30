package com.axora.backend.entity;

public enum TaskStatus {
    TODO("Yapılacak"),
    IN_PROGRESS("Devam Ediyor"),
    DONE("Tamamlandı");

    private final String displayName;

    TaskStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
} 