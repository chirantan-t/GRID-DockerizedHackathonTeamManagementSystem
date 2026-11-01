package com.hackathon.management.controller;

import com.hackathon.management.dto.ApiResponse;
import com.hackathon.management.dto.EvaluationCreateRequest;
import com.hackathon.management.dto.EvaluationResponseDto;
import com.hackathon.management.dto.EvaluationSummaryDto;
import com.hackathon.management.dto.EvaluationUpdateRequest;
import com.hackathon.management.service.EvaluationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evaluations")
public class EvaluationController {

    private final EvaluationService evaluationService;

    public EvaluationController(EvaluationService evaluationService) {
        this.evaluationService = evaluationService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ORGANIZER', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<EvaluationResponseDto>> createEvaluation(
            @Valid @RequestBody EvaluationCreateRequest request,
            Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));
        EvaluationResponseDto created = evaluationService.createEvaluation(request, authentication.getName(), isAdmin);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Evaluation submitted successfully", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EvaluationResponseDto>> getEvaluationById(@PathVariable Long id) {
        EvaluationResponseDto evaluation = evaluationService.getEvaluationById(id);
        return ResponseEntity.ok(ApiResponse.success(evaluation));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<EvaluationResponseDto>> updateEvaluation(
            @PathVariable Long id,
            @Valid @RequestBody EvaluationUpdateRequest request,
            Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));
        EvaluationResponseDto updated = evaluationService.updateEvaluation(id, request, authentication.getName(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Evaluation updated successfully", updated));
    }

    @GetMapping("/submission/{submissionId}")
    public ResponseEntity<ApiResponse<List<EvaluationResponseDto>>> getEvaluationsBySubmission(@PathVariable Long submissionId) {
        List<EvaluationResponseDto> list = evaluationService.getEvaluationsBySubmission(submissionId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/submission/{submissionId}/summary")
    public ResponseEntity<ApiResponse<EvaluationSummaryDto>> getEvaluationSummary(@PathVariable Long submissionId) {
        EvaluationSummaryDto summary = evaluationService.getEvaluationSummary(submissionId);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }
}

