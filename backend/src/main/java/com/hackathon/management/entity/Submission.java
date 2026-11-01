package com.hackathon.management.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "submissions")
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "registration_id", nullable = false, unique = true)
    private HackathonRegistration registration;

    @NotBlank(message = "Project title is required")
    @Column(name = "project_title", nullable = false, length = 150)
    private String projectTitle;

    @NotBlank(message = "Project description is required")
    @Column(name = "project_description", nullable = false, columnDefinition = "TEXT")
    private String projectDescription;

    @Column(name = "github_url", length = 255)
    private String githubUrl;

    @Column(name = "demo_url", length = 255)
    private String demoUrl;

    @Column(name = "presentation_url", length = 255)
    private String presentationUrl;

    @Column(name = "document_url", length = 255)
    private String documentUrl;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "submission_status", nullable = false, length = 30)
    private SubmissionStatus submissionStatus = SubmissionStatus.DRAFT;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @JsonIgnore
    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Evaluation> evaluations = new ArrayList<>();

    public Submission() {
    }

    public Submission(HackathonRegistration registration, String projectTitle, String projectDescription) {
        this.registration = registration;
        this.projectTitle = projectTitle;
        this.projectDescription = projectDescription;
        this.submissionStatus = SubmissionStatus.DRAFT;
    }

    @PrePersist
    protected void onCreate() {
        this.updatedAt = LocalDateTime.now();
        if (this.submissionStatus == null) {
            this.submissionStatus = SubmissionStatus.DRAFT;
        }
        if (this.submissionStatus == SubmissionStatus.SUBMITTED && this.submittedAt == null) {
            this.submittedAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        if (this.submissionStatus == SubmissionStatus.SUBMITTED && this.submittedAt == null) {
            this.submittedAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public HackathonRegistration getRegistration() {
        return registration;
    }

    public void setRegistration(HackathonRegistration registration) {
        this.registration = registration;
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
        if (submissionStatus == SubmissionStatus.SUBMITTED && this.submittedAt == null) {
            this.submittedAt = LocalDateTime.now();
        }
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

    public List<Evaluation> getEvaluations() {
        return evaluations;
    }

    public void setEvaluations(List<Evaluation> evaluations) {
        this.evaluations = evaluations;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Submission other)) return false;
        return id != null && id.equals(other.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}

