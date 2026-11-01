package com.hackathon.management.dto;

import com.hackathon.management.entity.HackathonStatus;
import jakarta.validation.constraints.NotNull;

public class HackathonStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private HackathonStatus status;

    public HackathonStatusUpdateRequest() {
    }

    public HackathonStatusUpdateRequest(HackathonStatus status) {
        this.status = status;
    }

    public HackathonStatus getStatus() {
        return status;
    }

    public void setStatus(HackathonStatus status) {
        this.status = status;
    }
}

