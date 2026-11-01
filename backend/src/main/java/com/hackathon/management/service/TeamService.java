package com.hackathon.management.service;

import com.hackathon.management.dto.*;
import com.hackathon.management.entity.*;
import com.hackathon.management.exception.DuplicateResourceException;
import com.hackathon.management.exception.InvalidWorkflowException;
import com.hackathon.management.exception.ResourceNotFoundException;
import com.hackathon.management.exception.UnauthorizedActionException;
import com.hackathon.management.repository.TeamRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@Transactional
public class TeamService {

    private final TeamRepository teamRepository;
    private final com.hackathon.management.repository.UserRepository userRepository;

    public TeamService(TeamRepository teamRepository) {
        this(teamRepository, null);
    }

    @org.springframework.beans.factory.annotation.Autowired
    public TeamService(TeamRepository teamRepository, com.hackathon.management.repository.UserRepository userRepository) {
        this.teamRepository = teamRepository;
        this.userRepository = userRepository;
    }

    public TeamDto createTeam(TeamCreateRequest request) {
        if (teamRepository.existsByTeamCode(request.getTeamCode())) {
            throw new DuplicateResourceException("Team code '" + request.getTeamCode() + "' is already registered");
        }

        String lead = request.getTeamLead() != null ? request.getTeamLead().trim() : "";
        if (isLeadOnly()) {
            lead = getCurrentUsername();
        }

        Team team = new Team(
                request.getTeamName().trim(),
                request.getTeamCode().trim().toUpperCase(),
                request.getProjectTitle().trim(),
                request.getProjectDescription().trim(),
                lead,
                request.getTrack()
        );

        if (userRepository != null) {
            User creator = null;
            final String searchLead = lead;
            if (searchLead != null && !searchLead.isEmpty()) {
                creator = userRepository.findByEmail(searchLead).or(() -> userRepository.findByUsername(searchLead)).orElse(null);
            }
            if (creator == null) {
                creator = userRepository.findAll().stream().findFirst().orElse(null);
            }
            team.setCreatedBy(creator);
        }

        Team savedTeam = teamRepository.save(team);
        return convertToDto(savedTeam);
    }

    @Transactional(readOnly = true)
    public TeamDto getTeamById(Long id) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + id));
        validateTeamLeadAccess(team);
        return convertToDto(team);
    }

    @Transactional(readOnly = true)
    public TeamDto getTeamByCode(String teamCode) {
        Team team = teamRepository.findByTeamCode(teamCode.trim().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with code: " + teamCode));
        validateTeamLeadAccess(team);
        return convertToDto(team);
    }

    @Transactional(readOnly = true)
    public TeamDto getMyTeam() {
        String lead = getCurrentUsername();
        if (lead == null) {
            return null;
        }
        return teamRepository.findAll().stream()
                .filter(t -> lead.equalsIgnoreCase(t.getTeamLead()))
                .findFirst()
                .map(this::convertToDto)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public Page<TeamDto> getTeams(Pageable pageable, RegistrationStatus status, Track track) {
        if (isLeadOnly()) {
            String lead = getCurrentUsername();
            java.util.List<Team> leadTeams = teamRepository.findAll().stream()
                    .filter(t -> lead != null && lead.equalsIgnoreCase(t.getTeamLead()))
                    .collect(Collectors.toList());
            return new org.springframework.data.domain.PageImpl<>(leadTeams, pageable, leadTeams.size()).map(this::convertToDto);
        }
        Page<Team> teams = teamRepository.findAll(pageable);
        return teams.map(this::convertToDto);
    }

    @Transactional(readOnly = true)
    public Page<TeamDto> searchTeams(String query, RegistrationStatus status, Track track, Pageable pageable) {
        if (query == null || query.trim().isEmpty()) {
            return getTeams(pageable, status, track);
        }
        Page<Team> teams = teamRepository.searchTeams(query.trim(), pageable);
        return teams.map(this::convertToDto);
    }

    public TeamDto updateTeam(Long id, TeamUpdateRequest request) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + id));

        validateTeamLeadAccess(team);

        team.setTeamName(request.getTeamName().trim());
        team.setProjectTitle(request.getProjectTitle().trim());
        team.setProjectDescription(request.getProjectDescription().trim());
        if (!isLeadOnly()) {
            team.setTeamLead(request.getTeamLead().trim());
        }
        team.setTrack(request.getTrack());
        if (request.getProgressStatus() != null) {
            team.setProgressStatus(request.getProgressStatus());
        }

        Team updatedTeam = teamRepository.save(team);
        return convertToDto(updatedTeam);
    }

    public void deleteTeam(Long id) {
        if (!teamRepository.existsById(id)) {
            throw new ResourceNotFoundException("Team not found with ID: " + id);
        }
        teamRepository.deleteById(id);
    }

    public TeamDto updateTeamStatus(Long id, StatusChangeRequest request) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + id));

        validateTeamLeadAccess(team);

        RegistrationStatus currentStatus = team.getRegistrationStatus();
        RegistrationStatus targetStatus = request.getStatus();

        if (!currentStatus.canTransitionTo(targetStatus)) {
            throw new InvalidWorkflowException(
                    "Invalid status transition from " + currentStatus + " to " + targetStatus +
                    ". Permitted workflow: PENDING -> APPROVED | REJECTED | WITHDRAWN."
            );
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_SUPER_ADMIN"));
        boolean isOrganizer = auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ORGANIZER"));

        if (!isAdmin && !isOrganizer) {
            boolean isAllowedLeadAction = (currentStatus == RegistrationStatus.PENDING && targetStatus == RegistrationStatus.WITHDRAWN);
            if (!isAllowedLeadAction) {
                throw new UnauthorizedActionException("Only Organizers or Administrators can approve, reject, or complete teams.");
            }
        }

        team.setRegistrationStatus(targetStatus);
        Team updatedTeam = teamRepository.save(team);
        return convertToDto(updatedTeam);
    }

    public boolean isLeadOnly() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            return false;
        }
        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_TEAM_LEAD") || a.getAuthority().equals("ROLE_TEAM")) &&
                auth.getAuthorities().stream()
                .noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_SUPER_ADMIN") || a.getAuthority().equals("ROLE_ORGANIZER"));
    }

    public String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (auth != null) ? auth.getName() : null;
    }

    private void validateTeamLeadAccess(Team team) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            return;
        }
        boolean isLeadOnly = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_TEAM_LEAD") || a.getAuthority().equals("ROLE_TEAM")) &&
                auth.getAuthorities().stream()
                .noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_SUPER_ADMIN") || a.getAuthority().equals("ROLE_ORGANIZER"));

        if (isLeadOnly && !auth.getName().equalsIgnoreCase(team.getTeamLead())) {
            throw new UnauthorizedActionException("You are only permitted to manage your own team: " + team.getTeamLead());
        }
    }

    public TeamDto convertToDto(Team team) {
        TeamDto dto = new TeamDto();
        dto.setId(team.getId());
        dto.setTeamName(team.getTeamName());
        dto.setTeamCode(team.getTeamCode());
        dto.setProjectTitle(team.getProjectTitle());
        dto.setProjectDescription(team.getProjectDescription());
        dto.setTeamLead(team.getTeamLead());
        dto.setTrack(team.getTrack());
        dto.setRegistrationStatus(team.getRegistrationStatus());
        dto.setProgressStatus(team.getProgressStatus());
        dto.setMemberCount(team.getMemberCount());
        dto.setCreatedAt(team.getCreatedAt());
        dto.setUpdatedAt(team.getUpdatedAt());

        if (team.getMembers() != null) {
            dto.setMembers(team.getMembers().stream().map(m -> new TeamMemberDto(
                    m.getId(),
                    team.getId(),
                    m.getFullName(),
                    m.getEmail(),
                    m.getCollege(),
                    m.getDepartment(),
                    m.getTeamRole(),
                    m.getCreatedAt()
            )).collect(Collectors.toList()));
        }

        return dto;
    }
}
