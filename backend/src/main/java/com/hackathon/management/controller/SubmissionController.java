package com.hackathon.management.controller;

import com.hackathon.management.dto.ApiResponse;
import com.hackathon.management.dto.SubmissionCreateRequest;
import com.hackathon.management.dto.SubmissionResponseDto;
import com.hackathon.management.dto.SubmissionUpdateRequest;
import com.hackathon.management.service.SubmissionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    private final SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TEAM', 'TEAM_LEAD', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<SubmissionResponseDto>> createSubmission(
            @Valid @RequestBody SubmissionCreateRequest request,
            Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));
        SubmissionResponseDto created = submissionService.createSubmission(request, authentication.getName(), isAdmin);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Submission created successfully in DRAFT status", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SubmissionResponseDto>> getSubmissionById(@PathVariable Long id) {
        SubmissionResponseDto sub = submissionService.getSubmissionById(id);
        return ResponseEntity.ok(ApiResponse.success(sub));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEAM', 'TEAM_LEAD', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<SubmissionResponseDto>> updateSubmission(
            @PathVariable Long id,
            @Valid @RequestBody SubmissionUpdateRequest request,
            Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));
        SubmissionResponseDto updated = submissionService.updateSubmission(id, request, authentication.getName(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Submission updated successfully", updated));
    }

    @PostMapping("/{id}/finalize")
    @PreAuthorize("hasAnyRole('TEAM', 'TEAM_LEAD', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<SubmissionResponseDto>> finalizeSubmission(
            @PathVariable Long id,
            Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));
        SubmissionResponseDto finalized = submissionService.finalizeSubmission(id, authentication.getName(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Submission finalized and submitted successfully", finalized));
    }

    @GetMapping("/hackathon/{hackathonId}")
    public ResponseEntity<ApiResponse<List<SubmissionResponseDto>>> getSubmissionsByHackathon(@PathVariable Long hackathonId) {
        List<SubmissionResponseDto> list = submissionService.getSubmissionsByHackathon(hackathonId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<ApiResponse<List<SubmissionResponseDto>>> getSubmissionsByTeam(@PathVariable Long teamId) {
        List<SubmissionResponseDto> list = submissionService.getSubmissionsByTeam(teamId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }
}

