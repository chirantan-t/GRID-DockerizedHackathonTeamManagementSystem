package com.hackathon.management.service;

import com.hackathon.management.dto.StatusChangeRequest;
import com.hackathon.management.dto.TeamCreateRequest;
import com.hackathon.management.dto.TeamDto;
import com.hackathon.management.entity.RegistrationStatus;
import com.hackathon.management.entity.Team;
import com.hackathon.management.entity.Track;
import com.hackathon.management.exception.DuplicateResourceException;
import com.hackathon.management.exception.InvalidWorkflowException;
import com.hackathon.management.exception.ResourceNotFoundException;
import com.hackathon.management.repository.TeamRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@org.mockito.junit.jupiter.MockitoSettings(strictness = org.mockito.quality.Strictness.LENIENT)
class TeamServiceTest {

    @Mock
    private TeamRepository teamRepository;

    @Mock
    private Authentication authentication;

    @Mock
    private SecurityContext securityContext;

    private TeamService teamService;

    @BeforeEach
    void setUp() {
        teamService = new TeamService(teamRepository);
        SecurityContextHolder.setContext(securityContext);
        doReturn(authentication).when(securityContext).getAuthentication();
        doReturn(Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))).when(authentication).getAuthorities();
    }

    @Test
    @DisplayName("Should successfully create team when team code is unique")
    void testCreateTeam_Success() {
        TeamCreateRequest request = new TeamCreateRequest(
                "Cyber Titans", "HTM-CY-01", "Threat Sentinel", "Zero trust scanner", "lead_user", Track.CYBERSECURITY
        );

        when(teamRepository.existsByTeamCode("HTM-CY-01")).thenReturn(false);

        Team savedTeam = new Team(request.getTeamName(), request.getTeamCode(), request.getProjectTitle(),
                request.getProjectDescription(), request.getTeamLead(), request.getTrack());
        savedTeam.setId(10L);
        when(teamRepository.save(any(Team.class))).thenReturn(savedTeam);

        TeamDto result = teamService.createTeam(request);

        assertNotNull(result);
        assertEquals("Cyber Titans", result.getTeamName());
        assertEquals("HTM-CY-01", result.getTeamCode());
        assertEquals(RegistrationStatus.PENDING, result.getRegistrationStatus());
        verify(teamRepository, times(1)).save(any(Team.class));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when team code already exists")
    void testCreateTeam_DuplicateCode_ThrowsException() {
        TeamCreateRequest request = new TeamCreateRequest(
                "Duplicate Titans", "HTM-CY-01", "Threat Sentinel", "Zero trust scanner", "lead_user", Track.CYBERSECURITY
        );

        when(teamRepository.existsByTeamCode("HTM-CY-01")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> teamService.createTeam(request));
        verify(teamRepository, never()).save(any(Team.class));
    }

    @Test
    @DisplayName("Should transition team status according to allowed workflow")
    void testUpdateTeamStatus_ValidTransition_Success() {
        Team team = new Team("AI Lab", "HTM-AI-99", "Vision AI", "Desc", "lead", Track.AI_ML);
        team.setId(1L);
        team.setRegistrationStatus(RegistrationStatus.PENDING);

        when(teamRepository.findById(1L)).thenReturn(Optional.of(team));
        when(teamRepository.save(any(Team.class))).thenReturn(team);

        StatusChangeRequest request = new StatusChangeRequest(RegistrationStatus.APPROVED, "Verified");
        TeamDto updated = teamService.updateTeamStatus(1L, request);

        assertEquals(RegistrationStatus.APPROVED, updated.getRegistrationStatus());
        verify(teamRepository, times(1)).save(team);
    }

    @Test
    @DisplayName("Should reject illegal workflow transitions with InvalidWorkflowException")
    void testUpdateTeamStatus_InvalidTransition_ThrowsException() {
        Team team = new Team("AI Lab", "HTM-AI-99", "Vision AI", "Desc", "lead", Track.AI_ML);
        team.setId(1L);
        team.setRegistrationStatus(RegistrationStatus.WITHDRAWN);

        when(teamRepository.findById(1L)).thenReturn(Optional.of(team));

        // Attempt illegal transition WITHDRAWN -> APPROVED
        StatusChangeRequest request = new StatusChangeRequest(RegistrationStatus.APPROVED, "Illegal jump");

        assertThrows(InvalidWorkflowException.class, () -> teamService.updateTeamStatus(1L, request));
        verify(teamRepository, never()).save(any(Team.class));
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when team ID does not exist")
    void testGetTeamById_NotFound_ThrowsException() {
        when(teamRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> teamService.getTeamById(999L));
    }
}
