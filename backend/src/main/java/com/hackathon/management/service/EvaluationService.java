package com.hackathon.management.service;

import com.hackathon.management.dto.EvaluationCreateRequest;
import com.hackathon.management.dto.EvaluationResponseDto;
import com.hackathon.management.dto.EvaluationSummaryDto;
import com.hackathon.management.dto.EvaluationUpdateRequest;
import com.hackathon.management.entity.Evaluation;
import com.hackathon.management.entity.Submission;
import com.hackathon.management.entity.SubmissionStatus;
import com.hackathon.management.entity.User;
import com.hackathon.management.exception.DuplicateResourceException;
import com.hackathon.management.exception.InvalidWorkflowException;
import com.hackathon.management.exception.ResourceNotFoundException;
import com.hackathon.management.exception.UnauthorizedActionException;
import com.hackathon.management.repository.EvaluationRepository;
import com.hackathon.management.repository.SubmissionRepository;
import com.hackathon.management.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EvaluationService {

    private final EvaluationRepository evaluationRepository;
    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;

    public EvaluationService(EvaluationRepository evaluationRepository,
                             SubmissionRepository submissionRepository,
                             UserRepository userRepository) {
        this.evaluationRepository = evaluationRepository;
        this.submissionRepository = submissionRepository;
        this.userRepository = userRepository;
    }

    public EvaluationResponseDto createEvaluation(EvaluationCreateRequest request, String evaluatorEmail, boolean isAdmin) {
        User evaluator = userRepository.findByEmail(evaluatorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluator not found: " + evaluatorEmail));

        Submission submission = submissionRepository.findById(request.getSubmissionId())
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with ID: " + request.getSubmissionId()));

        if (submission.getSubmissionStatus() == SubmissionStatus.DRAFT) {
            throw new InvalidWorkflowException("Cannot evaluate a DRAFT submission.");
        }

        // Prevent duplicate evaluation: uk_submission_evaluator
        if (evaluationRepository.existsBySubmissionIdAndEvaluatorId(submission.getId(), evaluator.getId())) {
            throw new DuplicateResourceException("You have already evaluated this submission.");
        }

        validateScores(request.getInnovationScore(), request.getTechnicalScore(),
                request.getPresentationScore(), request.getImpactScore());

        BigDecimal total = calculateTotalScore(request.getInnovationScore(), request.getTechnicalScore(),
                request.getPresentationScore(), request.getImpactScore());

        Evaluation evaluation = new Evaluation(
                submission,
                evaluator,
                request.getInnovationScore(),
                request.getTechnicalScore(),
                request.getPresentationScore(),
                request.getImpactScore(),
                total,
                request.getFeedback()
        );

        Evaluation saved = evaluationRepository.save(evaluation);
        return mapToDto(saved);
    }

    public EvaluationResponseDto updateEvaluation(Long id, EvaluationUpdateRequest request, String userEmail, boolean isAdmin) {
        Evaluation evaluation = getEvaluationEntity(id);

        if (!isAdmin && (evaluation.getEvaluator() == null || !evaluation.getEvaluator().getEmail().equalsIgnoreCase(userEmail))) {
            throw new UnauthorizedActionException("You are not authorized to update this evaluation.");
        }

        validateScores(request.getInnovationScore(), request.getTechnicalScore(),
                request.getPresentationScore(), request.getImpactScore());

        BigDecimal total = calculateTotalScore(request.getInnovationScore(), request.getTechnicalScore(),
                request.getPresentationScore(), request.getImpactScore());

        evaluation.setInnovationScore(request.getInnovationScore());
        evaluation.setTechnicalScore(request.getTechnicalScore());
        evaluation.setPresentationScore(request.getPresentationScore());
        evaluation.setImpactScore(request.getImpactScore());
        evaluation.setTotalScore(total);
        evaluation.setFeedback(request.getFeedback());

        Evaluation saved = evaluationRepository.save(evaluation);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public EvaluationResponseDto getEvaluationById(Long id) {
        return mapToDto(getEvaluationEntity(id));
    }

    @Transactional(readOnly = true)
    public List<EvaluationResponseDto> getEvaluationsBySubmission(Long submissionId) {
        return evaluationRepository.findBySubmissionId(submissionId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EvaluationSummaryDto getEvaluationSummary(Long submissionId) {
        if (!submissionRepository.existsById(submissionId)) {
            throw new ResourceNotFoundException("Submission not found with ID: " + submissionId);
        }

        long count = evaluationRepository.countBySubmissionId(submissionId);
        if (count == 0) {
            return new EvaluationSummaryDto(submissionId, 0, 0.0, 0.0, 0.0, 0.0, 0.0);
        }

        List<Object[]> averages = evaluationRepository.getEvaluationAveragesBySubmissionId(submissionId);
        if (averages.isEmpty() || averages.get(0) == null) {
            return new EvaluationSummaryDto(submissionId, count, 0.0, 0.0, 0.0, 0.0, 0.0);
        }

        Object[] row = averages.get(0);
        Double avgInnov = row[0] != null ? ((Number) row[0]).doubleValue() : 0.0;
        Double avgTech = row[1] != null ? ((Number) row[1]).doubleValue() : 0.0;
        Double avgPres = row[2] != null ? ((Number) row[2]).doubleValue() : 0.0;
        Double avgImp = row[3] != null ? ((Number) row[3]).doubleValue() : 0.0;
        Double avgTot = row[4] != null ? ((Number) row[4]).doubleValue() : 0.0;

        return new EvaluationSummaryDto(submissionId, count, avgInnov, avgTech, avgPres, avgImp, avgTot);
    }

    public Evaluation getEvaluationEntity(Long id) {
        return evaluationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluation not found with ID: " + id));
    }

    private void validateScores(Integer innov, Integer tech, Integer pres, Integer impact) {
        if (innov < 0 || innov > 100 || tech < 0 || tech > 100 ||
            pres < 0 || pres > 100 || impact < 0 || impact > 100) {
            throw new InvalidWorkflowException("All evaluation scores must be between 0 and 100.");
        }
    }

    private BigDecimal calculateTotalScore(Integer innov, Integer tech, Integer pres, Integer impact) {
        double sum = innov + tech + pres + impact;
        return BigDecimal.valueOf(sum / 4.0).setScale(2, RoundingMode.HALF_UP);
    }

    public EvaluationResponseDto mapToDto(Evaluation evaluation) {
        EvaluationResponseDto dto = new EvaluationResponseDto();
        dto.setId(evaluation.getId());
        if (evaluation.getSubmission() != null) {
            dto.setSubmissionId(evaluation.getSubmission().getId());
        }
        if (evaluation.getEvaluator() != null) {
            dto.setEvaluatorId(evaluation.getEvaluator().getId());
            dto.setEvaluatorName(evaluation.getEvaluator().getFullName());
        }
        dto.setInnovationScore(evaluation.getInnovationScore());
        dto.setTechnicalScore(evaluation.getTechnicalScore());
        dto.setPresentationScore(evaluation.getPresentationScore());
        dto.setImpactScore(evaluation.getImpactScore());
        dto.setTotalScore(evaluation.getTotalScore());
        dto.setFeedback(evaluation.getFeedback());
        dto.setEvaluatedAt(evaluation.getEvaluatedAt());
        return dto;
    }
}
