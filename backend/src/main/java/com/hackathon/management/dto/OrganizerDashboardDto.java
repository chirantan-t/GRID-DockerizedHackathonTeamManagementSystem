package com.hackathon.management.dto;

import java.util.List;

public class OrganizerDashboardDto {
    private long totalHackathons;
    private long publishedHackathons;
    private long ongoingHackathons;
    private long totalRegistrations;
    private long totalSubmissions;
    private List<HackathonResponseDto> ownedHackathons;
    private List<RegistrationResponseDto> recentRegistrations;

    public OrganizerDashboardDto() {
    }

    public long getTotalHackathons() {
        return totalHackathons;
    }

    public void setTotalHackathons(long totalHackathons) {
        this.totalHackathons = totalHackathons;
    }

    public long getPublishedHackathons() {
        return publishedHackathons;
    }

    public void setPublishedHackathons(long publishedHackathons) {
        this.publishedHackathons = publishedHackathons;
    }

    public long getOngoingHackathons() {
        return ongoingHackathons;
    }

    public void setOngoingHackathons(long ongoingHackathons) {
        this.ongoingHackathons = ongoingHackathons;
    }

    public long getTotalRegistrations() {
        return totalRegistrations;
    }

    public void setTotalRegistrations(long totalRegistrations) {
        this.totalRegistrations = totalRegistrations;
    }

    public long getTotalSubmissions() {
        return totalSubmissions;
    }

    public void setTotalSubmissions(long totalSubmissions) {
        this.totalSubmissions = totalSubmissions;
    }

    public List<HackathonResponseDto> getOwnedHackathons() {
        return ownedHackathons;
    }

    public void setOwnedHackathons(List<HackathonResponseDto> ownedHackathons) {
        this.ownedHackathons = ownedHackathons;
    }

    public List<RegistrationResponseDto> getRecentRegistrations() {
        return recentRegistrations;
    }

    public void setRecentRegistrations(List<RegistrationResponseDto> recentRegistrations) {
        this.recentRegistrations = recentRegistrations;
    }
}

