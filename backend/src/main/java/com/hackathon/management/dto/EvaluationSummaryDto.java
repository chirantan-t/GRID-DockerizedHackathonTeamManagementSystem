package com.hackathon.management.dto;

public class EvaluationSummaryDto {
    private Long submissionId;
    private long evaluationsCount;
    private Double averageInnovationScore;
    private Double averageTechnicalScore;
    private Double averagePresentationScore;
    private Double averageImpactScore;
    private Double averageTotalScore;

    public EvaluationSummaryDto() {
    }

    public EvaluationSummaryDto(Long submissionId, long evaluationsCount, Double averageInnovationScore,
                                Double averageTechnicalScore, Double averagePresentationScore,
                                Double averageImpactScore, Double averageTotalScore) {
        this.submissionId = submissionId;
        this.evaluationsCount = evaluationsCount;
        this.averageInnovationScore = averageInnovationScore;
        this.averageTechnicalScore = averageTechnicalScore;
        this.averagePresentationScore = averagePresentationScore;
        this.averageImpactScore = averageImpactScore;
        this.averageTotalScore = averageTotalScore;
    }

    public Long getSubmissionId() {
        return submissionId;
    }

    public void setSubmissionId(Long submissionId) {
        this.submissionId = submissionId;
    }

    public long getEvaluationsCount() {
        return evaluationsCount;
    }

    public void setEvaluationsCount(long evaluationsCount) {
        this.evaluationsCount = evaluationsCount;
    }

    public Double getAverageInnovationScore() {
        return averageInnovationScore;
    }

    public void setAverageInnovationScore(Double averageInnovationScore) {
        this.averageInnovationScore = averageInnovationScore;
    }

    public Double getAverageTechnicalScore() {
        return averageTechnicalScore;
    }

    public void setAverageTechnicalScore(Double averageTechnicalScore) {
        this.averageTechnicalScore = averageTechnicalScore;
    }

    public Double getAveragePresentationScore() {
        return averagePresentationScore;
    }

    public void setAveragePresentationScore(Double averagePresentationScore) {
        this.averagePresentationScore = averagePresentationScore;
    }

    public Double getAverageImpactScore() {
        return averageImpactScore;
    }

    public void setAverageImpactScore(Double averageImpactScore) {
        this.averageImpactScore = averageImpactScore;
    }

    public Double getAverageTotalScore() {
        return averageTotalScore;
    }

    public void setAverageTotalScore(Double averageTotalScore) {
        this.averageTotalScore = averageTotalScore;
    }
}

