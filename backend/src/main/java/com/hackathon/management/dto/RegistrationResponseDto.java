package com.hackathon.management.dto;

import com.hackathon.management.entity.RegistrationStatus;
import java.time.LocalDateTime;

public class RegistrationResponseDto {
    private Long id;
    private Long hackathonId;
    private String hackathonTitle;
    private Long teamId;
    private String teamName;
    private String teamCode;
    private RegistrationStatus registrationStatus;
    private LocalDateTime registeredAt;
    private LocalDateTime approvedAt;
    private LocalDateTime updatedAt;

    public RegistrationResponseDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getHackathonId() {
        return hackathonId;
    }

    public void setHackathonId(Long hackathonId) {
        this.hackathonId = hackathonId;
    }

    public String getHackathonTitle() {
        return hackathonTitle;
    }

    public void setHackathonTitle(String hackathonTitle) {
        this.hackathonTitle = hackathonTitle;
    }

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public String getTeamCode() {
        return teamCode;
    }

    public void setTeamCode(String teamCode) {
        this.teamCode = teamCode;
    }

    public RegistrationStatus getRegistrationStatus() {
        return registrationStatus;
    }

    public void setRegistrationStatus(RegistrationStatus registrationStatus) {
        this.registrationStatus = registrationStatus;
    }

    public RegistrationStatus getStatus() {
        return registrationStatus;
    }

    public void setStatus(RegistrationStatus status) {
        this.registrationStatus = status;
    }

    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(LocalDateTime registeredAt) {
        this.registeredAt = registeredAt;
    }

    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

