package com.hackathon.management.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "evaluations", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"submission_id", "evaluator_id"}, name = "uk_submission_evaluator")
})
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "submission_id", nullable = false)
    @JsonIgnore
    private Submission submission;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "evaluator_id", nullable = false)
    private User evaluator;

    @NotNull(message = "Innovation score is required")
    @Min(0)
    @Max(100)
    @Column(name = "innovation_score", nullable = false)
    private Integer innovationScore;

    @NotNull(message = "Technical score is required")
    @Min(0)
    @Max(100)
    @Column(name = "technical_score", nullable = false)
    private Integer technicalScore;

    @NotNull(message = "Presentation score is required")
    @Min(0)
    @Max(100)
    @Column(name = "presentation_score", nullable = false)
    private Integer presentationScore;

    @NotNull(message = "Impact score is required")
    @Min(0)
    @Max(100)
    @Column(name = "impact_score", nullable = false)
    private Integer impactScore;

    @NotNull(message = "Total score is required")
    @Column(name = "total_score", precision = 5, scale = 2, nullable = false)
    private BigDecimal totalScore;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @Column(name = "evaluated_at", nullable = false, updatable = false)
    private LocalDateTime evaluatedAt;

    public Evaluation() {
    }

    public Evaluation(Submission submission, User evaluator, Integer innovationScore,
                      Integer technicalScore, Integer presentationScore, Integer impactScore,
                      BigDecimal totalScore, String feedback) {
        this.submission = submission;
        this.evaluator = evaluator;
        this.innovationScore = innovationScore;
        this.technicalScore = technicalScore;
        this.presentationScore = presentationScore;
        this.impactScore = impactScore;
        this.totalScore = totalScore;
        this.feedback = feedback;
    }

    @PrePersist
    protected void onCreate() {
        this.evaluatedAt = LocalDateTime.now();
        if (this.totalScore == null && innovationScore != null && technicalScore != null 
                && presentationScore != null && impactScore != null) {
            double avg = (innovationScore + technicalScore + presentationScore + impactScore) / 4.0;
            this.totalScore = BigDecimal.valueOf(avg);
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Submission getSubmission() {
        return submission;
    }

    public void setSubmission(Submission submission) {
        this.submission = submission;
    }

    public User getEvaluator() {
        return evaluator;
    }

    public void setEvaluator(User evaluator) {
        this.evaluator = evaluator;
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

    public BigDecimal getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(BigDecimal totalScore) {
        this.totalScore = totalScore;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public LocalDateTime getEvaluatedAt() {
        return evaluatedAt;
    }

    public void setEvaluatedAt(LocalDateTime evaluatedAt) {
        this.evaluatedAt = evaluatedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Evaluation)) return false;
        Evaluation that = (Evaluation) o;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}

