package com.hackathon.management.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hackathon.management.dto.StatusChangeRequest;
import com.hackathon.management.dto.TeamCreateRequest;
import com.hackathon.management.entity.RegistrationStatus;
import com.hackathon.management.entity.Team;
import com.hackathon.management.entity.Track;
import com.hackathon.management.entity.User;
import com.hackathon.management.repository.TeamRepository;
import com.hackathon.management.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TeamControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private UserRepository userRepository;

    private User defaultUser;

    @BeforeEach
    void cleanDatabase() {
        teamRepository.deleteAll();
        defaultUser = userRepository.findAll().stream().findFirst().orElseGet(() -> {
            User u = new User("Test Creator", "creator@grid.dev", "$2a$10$BjQ8IRnzrVWHBZ/xvWatsODgZHdMv5KVfbA.YO2rcHkCJFfXaWpFO");
            return userRepository.save(u);
        });
    }

    private Team createTestTeam(String name, String code, String proj, String desc, String lead, Track track) {
        Team t = new Team(name, code, proj, desc, lead, track);
        t.setCreatedBy(defaultUser);
        return t;
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    @DisplayName("POST /api/teams should create team and return 201 Created")
    void testCreateTeam_Success() throws Exception {
        TeamCreateRequest request = new TeamCreateRequest(
                "FinTech Innovators",
                "HTM-FT-101",
                "Algorithmic Micro-Lending",
                "Automated risk scoring using graph analytics",
                "admin",
                Track.FINTECH
        );

        mockMvc.perform(post("/api/teams")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.teamName").value("FinTech Innovators"))
                .andExpect(jsonPath("$.teamCode").value("HTM-FT-101"))
                .andExpect(jsonPath("$.registrationStatus").value("PENDING"));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    @DisplayName("GET /api/teams should return paginated list of teams")
    void testGetTeams_Paginated() throws Exception {
        Team team1 = createTestTeam("Alpha", "HTM-01", "Project 1", "Desc 1", "lead1", Track.AI_ML);
        Team team2 = createTestTeam("Beta", "HTM-02", "Project 2", "Desc 2", "lead2", Track.WEB3_BLOCKCHAIN);
        teamRepository.save(team1);
        teamRepository.save(team2);

        mockMvc.perform(get("/api/teams?page=0&size=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(2)))
                .andExpect(jsonPath("$.page.totalElements").value(2));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    @DisplayName("PATCH /api/teams/{id}/status should enforce status workflow and reject invalid jump")
    void testUpdateTeamStatus_WorkflowValidation() throws Exception {
        Team team = createTestTeam("Gamma", "HTM-03", "Project 3", "Desc 3", "lead3", Track.HEALTHTECH);
        Team saved = teamRepository.save(team);
        saved.setRegistrationStatus(RegistrationStatus.WITHDRAWN);

        // Attempt illegal jump WITHDRAWN -> APPROVED
        StatusChangeRequest invalidReq = new StatusChangeRequest(RegistrationStatus.APPROVED, "Illegal");

        mockMvc.perform(patch("/api/teams/" + saved.getId() + "/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));

        // Valid transition PENDING -> APPROVED
        saved.setRegistrationStatus(RegistrationStatus.PENDING);
        teamRepository.save(saved);

        StatusChangeRequest validReq = new StatusChangeRequest(RegistrationStatus.APPROVED, "Approved by admin");

        mockMvc.perform(patch("/api/teams/" + saved.getId() + "/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.registrationStatus").value("APPROVED"));
    }

    @Test
    @WithMockUser(username = "lead", roles = {"TEAM_LEAD"})
    @DisplayName("DELETE /api/teams/{id} should be forbidden for TEAM_LEAD")
    void testDeleteTeam_ForbiddenForLead() throws Exception {
        Team team = createTestTeam("Delta", "HTM-04", "Project 4", "Desc 4", "lead", Track.OPEN_INNOVATION);
        Team saved = teamRepository.save(team);

        mockMvc.perform(delete("/api/teams/" + saved.getId()))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    @DisplayName("DELETE /api/teams/{id} should succeed with 204 No Content for ADMIN")
    void testDeleteTeam_SuccessForAdmin() throws Exception {
        Team team = createTestTeam("Epsilon", "HTM-05", "Project 5", "Desc 5", "admin", Track.OPEN_INNOVATION);
        Team saved = teamRepository.save(team);

        mockMvc.perform(delete("/api/teams/" + saved.getId()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(username = "organizer", roles = {"ORGANIZER"})
    @DisplayName("DELETE /api/teams/{id} should be forbidden for ORGANIZER")
    void testDeleteTeam_ForbiddenForOrganizer() throws Exception {
        Team team = createTestTeam("Zeta", "HTM-06", "Project 6", "Desc 6", "somelead", Track.AI_ML);
        Team saved = teamRepository.save(team);

        mockMvc.perform(delete("/api/teams/" + saved.getId()))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "teamlead", roles = {"TEAM_LEAD"})
    @DisplayName("GET /api/teams should only return own team for TEAM_LEAD")
    void testGetTeams_ScopedForLead() throws Exception {
        Team myTeam = createTestTeam("My Team", "HTM-MY-01", "My Project", "Desc", "teamlead", Track.AI_ML);
        Team otherTeam = createTestTeam("Other Team", "HTM-OT-02", "Other Project", "Desc", "otherlead", Track.FINTECH);
        teamRepository.save(myTeam);
        teamRepository.save(otherTeam);

        mockMvc.perform(get("/api/teams"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].teamCode").value("HTM-MY-01"));
    }

    @Test
    @WithMockUser(username = "teamlead", roles = {"TEAM_LEAD"})
    @DisplayName("GET /api/teams/{id} should be forbidden for TEAM_LEAD accessing another team")
    void testGetTeamById_ForbiddenForOtherTeam() throws Exception {
        Team otherTeam = createTestTeam("Other Team", "HTM-OT-03", "Other Project", "Desc", "otherlead", Track.FINTECH);
        Team saved = teamRepository.save(otherTeam);

        mockMvc.perform(get("/api/teams/" + saved.getId()))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "teamlead", roles = {"TEAM_LEAD"})
    @DisplayName("GET /api/teams/my-team should return own team for TEAM_LEAD")
    void testGetMyTeam_Success() throws Exception {
        Team myTeam = createTestTeam("My Team", "HTM-MY-04", "My Project", "Desc", "teamlead", Track.AI_ML);
        teamRepository.save(myTeam);

        mockMvc.perform(get("/api/teams/my-team"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.teamCode").value("HTM-MY-04"))
                .andExpect(jsonPath("$.teamLead").value("teamlead"));
    }
}
