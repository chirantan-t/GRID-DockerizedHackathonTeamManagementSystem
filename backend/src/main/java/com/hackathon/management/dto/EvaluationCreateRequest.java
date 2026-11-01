package com.hackathon.management.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class EvaluationCreateRequest {

    @NotNull(message = "Submission ID is required")
    private Long submissionId;

    @NotNull(message = "Innovation score is required")
    @Min(value = 0, message = "Innovation score must be at least 0")
    @Max(value = 100, message = "Innovation score cannot exceed 100")
    private Integer innovationScore;

    @NotNull(message = "Technical score is required")
    @Min(value = 0, message = "Technical score must be at least 0")
    @Max(value = 100, message = "Technical score cannot exceed 100")
    private Integer technicalScore;

    @NotNull(message = "Presentation score is required")
    @Min(value = 0, message = "Presentation score must be at least 0")
    @Max(value = 100, message = "Presentation score cannot exceed 100")
    private Integer presentationScore;

    @NotNull(message = "Impact score is required")
    @Min(value = 0, message = "Impact score must be at least 0")
    @Max(value = 100, message = "Impact score cannot exceed 100")
    private Integer impactScore;

    private String feedback;

    public EvaluationCreateRequest() {
    }

    public Long getSubmissionId() {
        return submissionId;
    }

    public void setSubmissionId(Long submissionId) {
        this.submissionId = submissionId;
    }

    public Integer getInnovationScore() {
        return innovationScore;
    }

    public void setInnovationScore(Integer innovationScore) {
        this.innovationScore = innovationScore;
    }

    public Integer getTechnicalScore() {
        return technicalScore;
    }

    public void setTechnicalScore(Integer technicalScore) {
        this.technicalScore = technicalScore;
    }

    public Integer getPresentationScore() {
        return presentationScore;
    }

    public void setPresentationScore(Integer presentationScore) {
        this.presentationScore = presentationScore;
    }

    public Integer getImpactScore() {
        return impactScore;
    }

    public void setImpactScore(Integer impactScore) {
        this.impactScore = impactScore;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
}

