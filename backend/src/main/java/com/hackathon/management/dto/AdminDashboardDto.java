package com.hackathon.management.dto;

import java.util.List;

public class AdminDashboardDto {
    private long totalUsers;
    private long totalOrganizers;
    private long totalTeams;
    private long totalHackathons;
    private long totalRegistrations;
    private long totalSubmissions;
    private List<UserResponseDto> recentUsers;
    private List<HackathonResponseDto> recentHackathons;

    public AdminDashboardDto() {
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalOrganizers() {
        return totalOrganizers;
    }

    public void setTotalOrganizers(long totalOrganizers) {
        this.totalOrganizers = totalOrganizers;
    }

    public long getTotalTeams() {
        return totalTeams;
    }

    public void setTotalTeams(long totalTeams) {
        this.totalTeams = totalTeams;
    }

    public long getTotalHackathons() {
        return totalHackathons;
    }

    public void setTotalHackathons(long totalHackathons) {
        this.totalHackathons = totalHackathons;
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

    public List<UserResponseDto> getRecentUsers() {
        return recentUsers;
    }

    public void setRecentUsers(List<UserResponseDto> recentUsers) {
        this.recentUsers = recentUsers;
    }

    public List<HackathonResponseDto> getRecentHackathons() {
        return recentHackathons;
    }

    public void setRecentHackathons(List<HackathonResponseDto> recentHackathons) {
        this.recentHackathons = recentHackathons;
    }
}

