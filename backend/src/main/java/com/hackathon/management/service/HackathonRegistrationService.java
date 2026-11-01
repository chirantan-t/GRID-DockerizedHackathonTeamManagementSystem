package com.hackathon.management.service;

import com.hackathon.management.dto.RegistrationCreateRequest;
import com.hackathon.management.dto.RegistrationResponseDto;
import com.hackathon.management.dto.RegistrationStatusUpdateRequest;
import com.hackathon.management.entity.Hackathon;
import com.hackathon.management.entity.HackathonRegistration;
import com.hackathon.management.entity.HackathonStatus;
import com.hackathon.management.entity.RegistrationStatus;
import com.hackathon.management.entity.Team;
import com.hackathon.management.exception.DuplicateResourceException;
import com.hackathon.management.exception.InvalidWorkflowException;
import com.hackathon.management.exception.ResourceNotFoundException;
import com.hackathon.management.exception.UnauthorizedActionException;
import com.hackathon.management.repository.HackathonRegistrationRepository;
import com.hackathon.management.repository.HackathonRepository;
import com.hackathon.management.repository.TeamRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class HackathonRegistrationService {

    private final HackathonRegistrationRepository registrationRepository;
    private final HackathonRepository hackathonRepository;
    private final TeamRepository teamRepository;

    public HackathonRegistrationService(HackathonRegistrationRepository registrationRepository,
                                        HackathonRepository hackathonRepository,
                                        TeamRepository teamRepository) {
        this.registrationRepository = registrationRepository;
        this.hackathonRepository = hackathonRepository;
        this.teamRepository = teamRepository;
    }

    public RegistrationResponseDto registerTeam(RegistrationCreateRequest request, String userEmail, boolean isAdmin) {
        Hackathon hackathon = hackathonRepository.findById(request.getHackathonId())
                .orElseThrow(() -> new ResourceNotFoundException("Hackathon not found with ID: " + request.getHackathonId()));

        Team team = teamRepository.findById(request.getTeamId())
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + request.getTeamId()));

        // Validate user belongs to team
        validateTeamMembership(team, userEmail, isAdmin);

        // Enforce published / ongoing status
        if (hackathon.getStatus() != HackathonStatus.PUBLISHED && hackathon.getStatus() != HackathonStatus.ONGOING) {
            throw new InvalidWorkflowException("Registration is only permitted for PUBLISHED or ONGOING hackathons. Current status: " + hackathon.getStatus());
        }

        // Enforce registration deadline
        if (hackathon.getRegistrationDeadline() != null && LocalDateTime.now().isAfter(hackathon.getRegistrationDeadline())) {
            throw new InvalidWorkflowException("The registration deadline for this hackathon has passed: " + hackathon.getRegistrationDeadline());
        }

        // Enforce duplicate registration restriction: uk_hackathon_team
        if (registrationRepository.existsByHackathonIdAndTeamId(hackathon.getId(), team.getId())) {
            throw new DuplicateResourceException("Team '" + team.getTeamName() + "' is already registered for this hackathon.");
        }

        // Enforce team size limits
        int memberCount = team.getMemberCount();
        if (memberCount < hackathon.getMinTeamSize()) {
            throw new InvalidWorkflowException("Team size (" + memberCount + ") is below the minimum required (" + hackathon.getMinTeamSize() + ").");
        }
        if (memberCount > hackathon.getMaxTeamSize()) {
            throw new InvalidWorkflowException("Team size (" + memberCount + ") exceeds the maximum allowed (" + hackathon.getMaxTeamSize() + ").");
        }

        HackathonRegistration registration = new HackathonRegistration(hackathon, team, RegistrationStatus.PENDING);
        HackathonRegistration saved = registrationRepository.save(registration);
        return mapToDto(saved);
    }

    public RegistrationResponseDto approveRegistration(Long registrationId, String organizerEmail, boolean isAdmin) {
        HackathonRegistration reg = getRegistrationEntity(registrationId);
        validateOrganizerAccess(reg.getHackathon(), organizerEmail, isAdmin);

        if (reg.getRegistrationStatus() != RegistrationStatus.PENDING) {
            throw new InvalidWorkflowException("Only PENDING registrations can be approved. Current status: " + reg.getRegistrationStatus());
        }

        reg.setRegistrationStatus(RegistrationStatus.APPROVED);
        reg.setApprovedAt(LocalDateTime.now());
        HackathonRegistration saved = registrationRepository.save(reg);
        return mapToDto(saved);
    }

    public RegistrationResponseDto rejectRegistration(Long registrationId, String organizerEmail, boolean isAdmin) {
        HackathonRegistration reg = getRegistrationEntity(registrationId);
        validateOrganizerAccess(reg.getHackathon(), organizerEmail, isAdmin);

        if (reg.getRegistrationStatus() != RegistrationStatus.PENDING) {
            throw new InvalidWorkflowException("Only PENDING registrations can be rejected. Current status: " + reg.getRegistrationStatus());
        }

        reg.setRegistrationStatus(RegistrationStatus.REJECTED);
        HackathonRegistration saved = registrationRepository.save(reg);
        return mapToDto(saved);
    }

    public RegistrationResponseDto withdrawRegistration(Long registrationId, String userEmail, boolean isAdmin) {
        HackathonRegistration reg = getRegistrationEntity(registrationId);
        validateTeamMembership(reg.getTeam(), userEmail, isAdmin);

        if (reg.getRegistrationStatus() != RegistrationStatus.PENDING && reg.getRegistrationStatus() != RegistrationStatus.APPROVED) {
            throw new InvalidWorkflowException("Cannot withdraw registration with status: " + reg.getRegistrationStatus());
        }

        reg.setRegistrationStatus(RegistrationStatus.WITHDRAWN);
        HackathonRegistration saved = registrationRepository.save(reg);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public RegistrationResponseDto getRegistrationById(Long id) {
        return mapToDto(getRegistrationEntity(id));
    }

    @Transactional(readOnly = true)
    public List<RegistrationResponseDto> listRegistrationsByHackathon(Long hackathonId) {
        return registrationRepository.findByHackathonId(hackathonId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RegistrationResponseDto> listRegistrationsByTeam(Long teamId) {
        return registrationRepository.findByTeamId(teamId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public HackathonRegistration getRegistrationEntity(Long id) {
        return registrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hackathon registration not found with ID: " + id));
    }

    private void validateOrganizerAccess(Hackathon hackathon, String organizerEmail, boolean isAdmin) {
        if (isAdmin) {
            return;
        }
        if (hackathon.getOrganizer() == null || !hackathon.getOrganizer().getEmail().equalsIgnoreCase(organizerEmail)) {
            throw new UnauthorizedActionException("You are not authorized to manage registrations for this hackathon.");
        }
    }

    private void validateTeamMembership(Team team, String userEmail, boolean isAdmin) {
        if (isAdmin) {
            return;
        }
        boolean isCreator = team.getCreatedBy() != null && team.getCreatedBy().getEmail().equalsIgnoreCase(userEmail);
        boolean isMember = team.getMembers() != null && team.getMembers().stream()
                .anyMatch(m -> m.getEmail().equalsIgnoreCase(userEmail) ||
                        (m.getUser() != null && m.getUser().getEmail().equalsIgnoreCase(userEmail)));

        if (!isCreator && !isMember) {
            throw new UnauthorizedActionException("You are not authorized to perform actions for team: " + team.getTeamName());
        }
    }

    public RegistrationResponseDto mapToDto(HackathonRegistration reg) {
        RegistrationResponseDto dto = new RegistrationResponseDto();
        dto.setId(reg.getId());
        if (reg.getHackathon() != null) {
            dto.setHackathonId(reg.getHackathon().getId());
            dto.setHackathonTitle(reg.getHackathon().getTitle());
        }
        if (reg.getTeam() != null) {
            dto.setTeamId(reg.getTeam().getId());
            dto.setTeamName(reg.getTeam().getTeamName());
            dto.setTeamCode(reg.getTeam().getTeamCode());
        }
        dto.setRegistrationStatus(reg.getRegistrationStatus());
        dto.setRegisteredAt(reg.getRegisteredAt());
        dto.setApprovedAt(reg.getApprovedAt());
        dto.setUpdatedAt(reg.getUpdatedAt());
        return dto;
    }
}

