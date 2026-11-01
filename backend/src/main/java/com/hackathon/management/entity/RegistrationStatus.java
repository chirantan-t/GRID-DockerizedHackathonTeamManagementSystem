package com.hackathon.management.entity;

public enum RegistrationStatus {
    PENDING,
    APPROVED,
    REJECTED,
    WITHDRAWN;

    public boolean canTransitionTo(RegistrationStatus target) {
        if (this == target) {
            return true;
        }
        return switch (this) {
            case PENDING -> target == APPROVED || target == REJECTED || target == WITHDRAWN;
            case APPROVED -> target == WITHDRAWN;
            case REJECTED -> target == PENDING;
            case WITHDRAWN -> false;
        };
    }
}
