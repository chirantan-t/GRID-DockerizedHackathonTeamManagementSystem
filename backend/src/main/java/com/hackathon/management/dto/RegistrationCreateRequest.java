package com.hackathon.management.dto;

import jakarta.validation.constraints.NotNull;

public class RegistrationCreateRequest {

    @NotNull(message = "Hackathon ID is required")
    private Long hackathonId;

    @NotNull(message = "Team ID is required")
    private Long teamId;

    public RegistrationCreateRequest() {
    }

    public RegistrationCreateRequest(Long hackathonId, Long teamId) {
        this.hackathonId = hackathonId;
        this.teamId = teamId;
    }

    public Long getHackathonId() {
        return hackathonId;
    }

    public void setHackathonId(Long hackathonId) {
        this.hackathonId = hackathonId;
    }

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }
}

