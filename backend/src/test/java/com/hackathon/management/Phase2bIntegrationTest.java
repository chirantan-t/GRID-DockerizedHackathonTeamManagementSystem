package com.hackathon.management;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hackathon.management.dto.*;
import com.hackathon.management.entity.*;
import com.hackathon.management.repository.*;
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
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class Phase2bIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private HackathonRepository hackathonRepository;

    @Autowired
    private HackathonRegistrationRepository registrationRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private EvaluationRepository evaluationRepository;

    @Autowired
    private AnnouncementRepository announcementRepository;

    private User testOrganizer;
    private User testTeamUser;
    private Team testTeam;
    private Hackathon testHackathon;

    @BeforeEach
    void setUpData() {
        testOrganizer = userRepository.findByEmail("organizer@grid.dev").orElse(null);
        testTeamUser = userRepository.findByEmail("chirantan@grid.dev").orElse(null);

        // Create a published test hackathon
        testHackathon = new Hackathon(
                testOrganizer,
                "InnovateX Phase 2B",
                "Full integration test hackathon",
                "AI / ML",
                HackathonMode.HYBRID,
                LocalDateTime.now().minusDays(2),
                LocalDateTime.now().plusDays(5),
                LocalDateTime.now().plusDays(6),
                LocalDateTime.now().plusDays(8)
        );
        testHackathon.setMinTeamSize(1);
        testHackathon.setMaxTeamSize(4);
        testHackathon.setStatus(HackathonStatus.PUBLISHED);
        testHackathon = hackathonRepository.save(testHackathon);

        // Create a test team
        testTeam = new Team(
                "Code Titans",
                "TITAN" + System.currentTimeMillis() % 10000,
                "Titan AI",
                "Next-gen automated reasoning",
                testTeamUser != null ? testTeamUser.getEmail() : "chirantan@grid.dev",
                Track.AI_ML
        );
        testTeam.setCreatedBy(testTeamUser);
        testTeam = teamRepository.save(testTeam);

        if (testTeamUser != null) {
            TeamMember member = new TeamMember(
                    testTeamUser.getFullName(),
                    testTeamUser.getEmail(),
                    "VIT Mumbai",
                    "Computer Engineering",
                    TeamRole.FULLSTACK
            );
            member.setUser(testTeamUser);
            member.setTeam(testTeam);
            testTeam.addMember(member);
            testTeam = teamRepository.save(testTeam);
        }
    }

    // ==========================================
    // 1. AUTHENTICATION & USER MANAGEMENT
    // ==========================================

    @Test
    @DisplayName("1. User Registration: POST /api/auth/register creates user and hashes password")
    void testUserRegistration() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "New Developer",
                "dev" + System.currentTimeMillis() + "@grid.dev",
                "Password@123",
                "TEAM"
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.fullName").value("New Developer"))
                .andExpect(jsonPath("$.data.roles", hasItem("TEAM")));
    }

    @Test
    @DisplayName("2. User Profile: GET /api/users/profile returns current authenticated user")
    @WithMockUser(username = "chirantan@grid.dev", roles = {"TEAM"})
    void testGetUserProfile() throws Exception {
        mockMvc.perform(get("/api/users/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("chirantan@grid.dev"));
    }

    @Test
    @DisplayName("3. User Status: Super Admin can activate/deactivate user accounts")
    @WithMockUser(username = "superadmin@grid.dev", roles = {"SUPER_ADMIN"})
    void testUpdateUserStatus_SuperAdmin() throws Exception {
        UserStatusUpdateRequest request = new UserStatusUpdateRequest(false);

        mockMvc.perform(put("/api/users/" + testTeamUser.getId() + "/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.isActive").value(false));
    }

    // ==========================================
    // 2. HACKATHON LIFECYCLE & DISCOVERY
    // ==========================================

    @Test
    @DisplayName("4. Create Hackathon: Organizer can create hackathon in DRAFT status")
    @WithMockUser(username = "organizer@grid.dev", roles = {"ORGANIZER"})
    void testCreateHackathon_Organizer() throws Exception {
        HackathonCreateRequest request = new HackathonCreateRequest();
        request.setTitle("Cloud Hackathon 2026");
        request.setDescription("Build resilient cloud infrastructure");
        request.setCategory("Cloud");
        request.setMode(HackathonMode.ONLINE);
        request.setRegistrationStart(LocalDateTime.now().minusDays(1));
        request.setRegistrationDeadline(LocalDateTime.now().plusDays(10));
        request.setEventStart(LocalDateTime.now().plusDays(12));
        request.setEventEnd(LocalDateTime.now().plusDays(14));
        request.setMinTeamSize(1);
        request.setMaxTeamSize(4);
        request.setPrizePool("₹1,00,000");

        mockMvc.perform(post("/api/hackathons")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("Cloud Hackathon 2026"))
                .andExpect(jsonPath("$.data.status").value("DRAFT"));
    }

    @Test
    @DisplayName("5. Publish Hackathon: Organizer can transition DRAFT to PUBLISHED")
    @WithMockUser(username = "organizer@grid.dev", roles = {"ORGANIZER"})
    void testPublishHackathon() throws Exception {
        Hackathon draft = new Hackathon(
                testOrganizer,
                "Draft Hackathon",
                "Draft desc",
                "Web3",
                HackathonMode.ONLINE,
                LocalDateTime.now().minusDays(1),
                LocalDateTime.now().plusDays(5),
                LocalDateTime.now().plusDays(6),
                LocalDateTime.now().plusDays(7)
        );
        draft.setStatus(HackathonStatus.DRAFT);
        draft = hackathonRepository.save(draft);

        mockMvc.perform(post("/api/hackathons/" + draft.getId() + "/publish"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("PUBLISHED"));
    }

    @Test
    @DisplayName("6. Public Discovery: GET /api/hackathons returns published hackathons without auth")
    void testGetPublishedHackathons_Public() throws Exception {
        mockMvc.perform(get("/api/hackathons/published"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))));
    }

    // ==========================================
    // 3. HACKATHON REGISTRATIONS
    // ==========================================

    @Test
    @DisplayName("7. Team Registration: Team registers for published hackathon")
    @WithMockUser(username = "chirantan@grid.dev", roles = {"TEAM"})
    void testRegisterTeam_Success() throws Exception {
        RegistrationCreateRequest request = new RegistrationCreateRequest(
                testHackathon.getId(),
                testTeam.getId()
        );

        mockMvc.perform(post("/api/registrations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.registrationStatus").value("PENDING"));
    }

    @Test
    @DisplayName("8. Duplicate Registration Prevention: Cannot register same team twice")
    @WithMockUser(username = "chirantan@grid.dev", roles = {"TEAM"})
    void testDuplicateRegistration_Fails() throws Exception {
        // Register once
        HackathonRegistration reg = new HackathonRegistration(testHackathon, testTeam, RegistrationStatus.PENDING);
        registrationRepository.save(reg);

        RegistrationCreateRequest request = new RegistrationCreateRequest(
                testHackathon.getId(),
                testTeam.getId()
        );

        mockMvc.perform(post("/api/registrations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("9. Registration Approval: Organizer approves pending registration")
    @WithMockUser(username = "organizer@grid.dev", roles = {"ORGANIZER"})
    void testApproveRegistration() throws Exception {
        HackathonRegistration reg = new HackathonRegistration(testHackathon, testTeam, RegistrationStatus.PENDING);
        reg = registrationRepository.save(reg);

        mockMvc.perform(post("/api/registrations/" + reg.getId() + "/approve"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.registrationStatus").value("APPROVED"));
    }

    // ==========================================
    // 4. SUBMISSIONS
    // ==========================================

    @Test
    @DisplayName("10. Create Submission: Team creates submission for approved registration")
    @WithMockUser(username = "chirantan@grid.dev", roles = {"TEAM"})
    void testCreateSubmission_Success() throws Exception {
        HackathonRegistration reg = new HackathonRegistration(testHackathon, testTeam, RegistrationStatus.APPROVED);
        reg = registrationRepository.save(reg);

        SubmissionCreateRequest request = new SubmissionCreateRequest();
        request.setRegistrationId(reg.getId());
        request.setProjectTitle("Titan Intelligent Router");
        request.setProjectDescription("High throughput autonomous network router");
        request.setGithubUrl("https://github.com/grid/titan-router");

        mockMvc.perform(post("/api/submissions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.submissionStatus").value("DRAFT"))
                .andExpect(jsonPath("$.data.projectTitle").value("Titan Intelligent Router"));
    }

    @Test
    @DisplayName("11. Finalize Submission: Team finalizes DRAFT submission to SUBMITTED")
    @WithMockUser(username = "chirantan@grid.dev", roles = {"TEAM"})
    void testFinalizeSubmission() throws Exception {
        HackathonRegistration reg = new HackathonRegistration(testHackathon, testTeam, RegistrationStatus.APPROVED);
        reg = registrationRepository.save(reg);

        Submission submission = new Submission(reg, "Titan Edge", "Edge computing system");
        submission.setSubmissionStatus(SubmissionStatus.DRAFT);
        submission = submissionRepository.save(submission);

        mockMvc.perform(post("/api/submissions/" + submission.getId() + "/finalize"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.submissionStatus").value("SUBMITTED"));
    }

    // ==========================================
    // 5. EVALUATIONS
    // ==========================================

    @Test
    @DisplayName("12. Evaluate Submission: Organizer evaluates submission with 0-100 scoring")
    @WithMockUser(username = "organizer@grid.dev", roles = {"ORGANIZER"})
    void testEvaluateSubmission_Success() throws Exception {
        HackathonRegistration reg = new HackathonRegistration(testHackathon, testTeam, RegistrationStatus.APPROVED);
        reg = registrationRepository.save(reg);

        Submission submission = new Submission(reg, "Titan Edge", "Edge computing system");
        submission.setSubmissionStatus(SubmissionStatus.SUBMITTED);
        submission = submissionRepository.save(submission);

        EvaluationCreateRequest request = new EvaluationCreateRequest();
        request.setSubmissionId(submission.getId());
        request.setInnovationScore(90);
        request.setTechnicalScore(85);
        request.setPresentationScore(80);
        request.setImpactScore(95);
        request.setFeedback("Superb architecture and execution!");

        mockMvc.perform(post("/api/evaluations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.totalScore").value(87.50));
    }

    // ==========================================
    // 6. ANNOUNCEMENTS
    // ==========================================

    @Test
    @DisplayName("13. Create Announcement: Organizer publishes hackathon announcement")
    @WithMockUser(username = "organizer@grid.dev", roles = {"ORGANIZER"})
    void testCreateAnnouncement() throws Exception {
        AnnouncementCreateRequest request = new AnnouncementCreateRequest(
                testHackathon.getId(),
                "Evaluation Criteria Briefing",
                "The jury will begin round 1 evaluation at 4 PM.",
                AnnouncementPriority.IMPORTANT
        );

        mockMvc.perform(post("/api/announcements")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.title").value("Evaluation Criteria Briefing"))
                .andExpect(jsonPath("$.data.priority").value("IMPORTANT"));
    }

    // ==========================================
    // 7. ROLE-SPECIFIC DASHBOARDS
    // ==========================================

    @Test
    @DisplayName("14. Team Dashboard: GET /api/dashboard/team returns team metrics")
    @WithMockUser(username = "chirantan@grid.dev", roles = {"TEAM"})
    void testTeamDashboard() throws Exception {
        mockMvc.perform(get("/api/dashboard/team"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.myTeams", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    @DisplayName("15. Organizer Dashboard: GET /api/dashboard/organizer returns event metrics")
    @WithMockUser(username = "organizer@grid.dev", roles = {"ORGANIZER"})
    void testOrganizerDashboard() throws Exception {
        mockMvc.perform(get("/api/dashboard/organizer"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalHackathons", greaterThanOrEqualTo(1)));
    }

    @Test
    @DisplayName("16. Admin Dashboard: GET /api/dashboard/admin returns platform-wide metrics")
    @WithMockUser(username = "superadmin@grid.dev", roles = {"SUPER_ADMIN"})
    void testAdminDashboard() throws Exception {
        mockMvc.perform(get("/api/dashboard/admin"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalUsers", greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$.data.totalHackathons", greaterThanOrEqualTo(1)));
    }
}
