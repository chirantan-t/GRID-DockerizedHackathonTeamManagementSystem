package com.hackathon.management.dto;

import com.hackathon.management.entity.RegistrationStatus;
import jakarta.validation.constraints.NotNull;

public class RegistrationStatusUpdateRequest {

    @NotNull(message = "Registration status is required")
    private RegistrationStatus status;

    public RegistrationStatusUpdateRequest() {
    }

    public RegistrationStatusUpdateRequest(RegistrationStatus status) {
        this.status = status;
    }

    public RegistrationStatus getStatus() {
        return status;
    }

    public void setStatus(RegistrationStatus status) {
        this.status = status;
    }
}

