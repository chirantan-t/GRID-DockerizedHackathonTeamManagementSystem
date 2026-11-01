package com.hackathon.management.dto;

import com.hackathon.management.entity.SubmissionStatus;
import java.time.LocalDateTime;

public class SubmissionResponseDto {
    private Long id;
    private Long registrationId;
    private Long hackathonId;
    private String hackathonTitle;
    private Long teamId;
    private String teamName;
    private String projectTitle;
    private String projectDescription;
    private String githubUrl;
    private String demoUrl;
    private String presentationUrl;
    private String documentUrl;
    private SubmissionStatus submissionStatus;
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;
    private long evaluationsCount;
    private Double averageTotalScore;

    public SubmissionResponseDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRegistrationId() {
        return registrationId;
    }

    public void setRegistrationId(Long registrationId) {
        this.registrationId = registrationId;
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

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }

    public String getProjectDescription() {
        return projectDescription;
    }

    public void setProjectDescription(String projectDescription) {
        this.projectDescription = projectDescription;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public String getDemoUrl() {
        return demoUrl;
    }

    public void setDemoUrl(String demoUrl) {
        this.demoUrl = demoUrl;
    }

    public String getPresentationUrl() {
        return presentationUrl;
    }

    public void setPresentationUrl(String presentationUrl) {
        this.presentationUrl = presentationUrl;
    }

    public String getDocumentUrl() {
        return documentUrl;
    }

    public void setDocumentUrl(String documentUrl) {
        this.documentUrl = documentUrl;
    }

    public SubmissionStatus getSubmissionStatus() {
        return submissionStatus;
    }

    public void setSubmissionStatus(SubmissionStatus submissionStatus) {
        this.submissionStatus = submissionStatus;
    }

    public SubmissionStatus getStatus() {
        return submissionStatus;
    }

    public void setStatus(SubmissionStatus status) {
        this.submissionStatus = status;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public long getEvaluationsCount() {
        return evaluationsCount;
    }

    public void setEvaluationsCount(long evaluationsCount) {
        this.evaluationsCount = evaluationsCount;
    }

    public Double getAverageTotalScore() {
        return averageTotalScore;
    }

    public void setAverageTotalScore(Double averageTotalScore) {
        this.averageTotalScore = averageTotalScore;
    }
}

