package com.hackathon.management.dto;

import java.util.List;

public class TeamDashboardDto {
    private long registeredHackathonsCount;
    private long activeSubmissionsCount;
    private long inProgressHackathonsCount;
    private long completedHackathonsCount;
    private List<TeamDto> myTeams;
    private List<RegistrationResponseDto> registrations;
    private List<AnnouncementResponseDto> recentAnnouncements;

    public TeamDashboardDto() {
    }

    public long getRegisteredHackathonsCount() {
        return registeredHackathonsCount;
    }

    public void setRegisteredHackathonsCount(long registeredHackathonsCount) {
        this.registeredHackathonsCount = registeredHackathonsCount;
    }

    public long getActiveSubmissionsCount() {
        return activeSubmissionsCount;
    }

    public void setActiveSubmissionsCount(long activeSubmissionsCount) {
        this.activeSubmissionsCount = activeSubmissionsCount;
    }

    public long getInProgressHackathonsCount() {
        return inProgressHackathonsCount;
    }

    public void setInProgressHackathonsCount(long inProgressHackathonsCount) {
        this.inProgressHackathonsCount = inProgressHackathonsCount;
    }

    public long getCompletedHackathonsCount() {
        return completedHackathonsCount;
    }

    public void setCompletedHackathonsCount(long completedHackathonsCount) {
        this.completedHackathonsCount = completedHackathonsCount;
    }

    public List<TeamDto> getMyTeams() {
        return myTeams;
    }

    public void setMyTeams(List<TeamDto> myTeams) {
        this.myTeams = myTeams;
    }

    public List<RegistrationResponseDto> getRegistrations() {
        return registrations;
    }

    public void setRegistrations(List<RegistrationResponseDto> registrations) {
        this.registrations = registrations;
    }

    public List<AnnouncementResponseDto> getRecentAnnouncements() {
        return recentAnnouncements;
    }

    public void setRecentAnnouncements(List<AnnouncementResponseDto> recentAnnouncements) {
        this.recentAnnouncements = recentAnnouncements;
    }
}

