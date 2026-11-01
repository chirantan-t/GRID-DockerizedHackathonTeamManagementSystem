package com.hackathon.management.service;

import com.hackathon.management.dto.SubmissionCreateRequest;
import com.hackathon.management.dto.SubmissionResponseDto;
import com.hackathon.management.dto.SubmissionUpdateRequest;
import com.hackathon.management.entity.HackathonRegistration;
import com.hackathon.management.entity.RegistrationStatus;
import com.hackathon.management.entity.Submission;
import com.hackathon.management.entity.SubmissionStatus;
import com.hackathon.management.entity.Team;
import com.hackathon.management.exception.DuplicateResourceException;
import com.hackathon.management.exception.InvalidWorkflowException;
import com.hackathon.management.exception.ResourceNotFoundException;
import com.hackathon.management.exception.UnauthorizedActionException;
import com.hackathon.management.repository.EvaluationRepository;
import com.hackathon.management.repository.HackathonRegistrationRepository;
import com.hackathon.management.repository.SubmissionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final HackathonRegistrationRepository registrationRepository;
    private final EvaluationRepository evaluationRepository;

    public SubmissionService(SubmissionRepository submissionRepository,
                             HackathonRegistrationRepository registrationRepository,
                             EvaluationRepository evaluationRepository) {
        this.submissionRepository = submissionRepository;
        this.registrationRepository = registrationRepository;
        this.evaluationRepository = evaluationRepository;
    }

    public SubmissionResponseDto createSubmission(SubmissionCreateRequest request, String userEmail, boolean isAdmin) {
        HackathonRegistration registration = registrationRepository.findById(request.getRegistrationId())
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with ID: " + request.getRegistrationId()));

        validateTeamAccess(registration.getTeam(), userEmail, isAdmin);

        if (registration.getRegistrationStatus() != RegistrationStatus.APPROVED) {
            throw new InvalidWorkflowException("Submissions are only allowed for APPROVED registrations. Current status: " + registration.getRegistrationStatus());
        }

        if (submissionRepository.existsByRegistrationId(registration.getId())) {
            throw new DuplicateResourceException("A submission already exists for this registration.");
        }

        if (registration.getHackathon().getEventEnd() != null && LocalDateTime.now().isAfter(registration.getHackathon().getEventEnd())) {
            throw new InvalidWorkflowException("The submission window has closed. Event ended on: " + registration.getHackathon().getEventEnd());
        }

        Submission submission = new Submission(
                registration,
                request.getProjectTitle().trim(),
                request.getProjectDescription().trim()
        );
        submission.setGithubUrl(request.getGithubUrl());
        submission.setDemoUrl(request.getDemoUrl());
        submission.setPresentationUrl(request.getPresentationUrl());
        submission.setDocumentUrl(request.getDocumentUrl());
        submission.setSubmissionStatus(SubmissionStatus.DRAFT);

        Submission saved = submissionRepository.save(submission);
        return mapToDto(saved);
    }

    public SubmissionResponseDto updateSubmission(Long id, SubmissionUpdateRequest request, String userEmail, boolean isAdmin) {
        Submission submission = getSubmissionEntity(id);
        validateTeamAccess(submission.getRegistration().getTeam(), userEmail, isAdmin);

        if (submission.getSubmissionStatus() != SubmissionStatus.DRAFT) {
            throw new InvalidWorkflowException("Cannot update submission that has already been submitted. Current status: " + submission.getSubmissionStatus());
        }

        if (request.getProjectTitle() != null && !request.getProjectTitle().isBlank()) {
            submission.setProjectTitle(request.getProjectTitle().trim());
        }
        if (request.getProjectDescription() != null && !request.getProjectDescription().isBlank()) {
            submission.setProjectDescription(request.getProjectDescription().trim());
        }
        if (request.getGithubUrl() != null) {
            submission.setGithubUrl(request.getGithubUrl().trim());
        }
        if (request.getDemoUrl() != null) {
            submission.setDemoUrl(request.getDemoUrl().trim());
        }
        if (request.getPresentationUrl() != null) {
            submission.setPresentationUrl(request.getPresentationUrl().trim());
        }
        if (request.getDocumentUrl() != null) {
            submission.setDocumentUrl(request.getDocumentUrl().trim());
        }

        Submission saved = submissionRepository.save(submission);
        return mapToDto(saved);
    }

    public SubmissionResponseDto finalizeSubmission(Long id, String userEmail, boolean isAdmin) {
        Submission submission = getSubmissionEntity(id);
        validateTeamAccess(submission.getRegistration().getTeam(), userEmail, isAdmin);

        if (submission.getSubmissionStatus() != SubmissionStatus.DRAFT) {
            throw new InvalidWorkflowException("Only DRAFT submissions can be finalized. Current status: " + submission.getSubmissionStatus());
        }

        if (submission.getRegistration().getHackathon().getEventEnd() != null &&
            LocalDateTime.now().isAfter(submission.getRegistration().getHackathon().getEventEnd())) {
            throw new InvalidWorkflowException("Cannot submit: the event deadline has passed.");
        }

        submission.setSubmissionStatus(SubmissionStatus.SUBMITTED);
        submission.setSubmittedAt(LocalDateTime.now());
        Submission saved = submissionRepository.save(submission);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public SubmissionResponseDto getSubmissionById(Long id) {
        return mapToDto(getSubmissionEntity(id));
    }

    @Transactional(readOnly = true)
    public List<SubmissionResponseDto> getSubmissionsByHackathon(Long hackathonId) {
        return submissionRepository.findByHackathonId(hackathonId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SubmissionResponseDto> getSubmissionsByTeam(Long teamId) {
        return submissionRepository.findByTeamId(teamId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public Submission getSubmissionEntity(Long id) {
        return submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with ID: " + id));
    }

    private void validateTeamAccess(Team team, String userEmail, boolean isAdmin) {
        if (isAdmin) {
            return;
        }
        boolean isCreator = team.getCreatedBy() != null && team.getCreatedBy().getEmail().equalsIgnoreCase(userEmail);
        boolean isMember = team.getMembers() != null && team.getMembers().stream()
                .anyMatch(m -> m.getEmail().equalsIgnoreCase(userEmail) ||
                        (m.getUser() != null && m.getUser().getEmail().equalsIgnoreCase(userEmail)));

        if (!isCreator && !isMember) {
            throw new UnauthorizedActionException("You are not authorized to manage submissions for team: " + team.getTeamName());
        }
    }

    public SubmissionResponseDto mapToDto(Submission submission) {
        SubmissionResponseDto dto = new SubmissionResponseDto();
        dto.setId(submission.getId());
        if (submission.getRegistration() != null) {
            dto.setRegistrationId(submission.getRegistration().getId());
            if (submission.getRegistration().getHackathon() != null) {
                dto.setHackathonId(submission.getRegistration().getHackathon().getId());
                dto.setHackathonTitle(submission.getRegistration().getHackathon().getTitle());
            }
            if (submission.getRegistration().getTeam() != null) {
                dto.setTeamId(submission.getRegistration().getTeam().getId());
                dto.setTeamName(submission.getRegistration().getTeam().getTeamName());
            }
        }
        dto.setProjectTitle(submission.getProjectTitle());
        dto.setProjectDescription(submission.getProjectDescription());
        dto.setGithubUrl(submission.getGithubUrl());
        dto.setDemoUrl(submission.getDemoUrl());
        dto.setPresentationUrl(submission.getPresentationUrl());
        dto.setDocumentUrl(submission.getDocumentUrl());
        dto.setSubmissionStatus(submission.getSubmissionStatus());
        dto.setSubmittedAt(submission.getSubmittedAt());
        dto.setUpdatedAt(submission.getUpdatedAt());

        long count = evaluationRepository.countBySubmissionId(submission.getId());
        dto.setEvaluationsCount(count);
        if (count > 0) {
            dto.setAverageTotalScore(evaluationRepository.findAverageTotalScoreBySubmissionId(submission.getId()));
        }

        return dto;
    }
}
