package com.hackathon.management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class SubmissionCreateRequest {

    @NotNull(message = "Registration ID is required")
    private Long registrationId;

    @NotBlank(message = "Project title is required")
    @Size(min = 3, max = 150, message = "Project title must be between 3 and 150 characters")
    private String projectTitle;

    @NotBlank(message = "Project description is required")
    private String projectDescription;

    @Size(max = 255, message = "GitHub URL cannot exceed 255 characters")
    private String githubUrl;

    @Size(max = 255, message = "Demo URL cannot exceed 255 characters")
    private String demoUrl;

    @Size(max = 255, message = "Presentation URL cannot exceed 255 characters")
    private String presentationUrl;

    @Size(max = 255, message = "Document URL cannot exceed 255 characters")
    private String documentUrl;

    public SubmissionCreateRequest() {
    }

    public Long getRegistrationId() {
        return registrationId;
    }

    public void setRegistrationId(Long registrationId) {
        this.registrationId = registrationId;
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

    public String getRepositoryUrl() {
        return githubUrl;
    }

    public void setRepositoryUrl(String repositoryUrl) {
        this.githubUrl = repositoryUrl;
    }

    public String getDemoVideoUrl() {
        return demoUrl;
    }

    public void setDemoVideoUrl(String demoVideoUrl) {
        this.demoUrl = demoVideoUrl;
    }

    public String getDocumentationUrl() {
        return documentUrl;
    }

    public void setDocumentationUrl(String documentationUrl) {
        this.documentUrl = documentationUrl;
    }
}

