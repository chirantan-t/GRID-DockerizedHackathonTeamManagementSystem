package com.hackathon.management;

import com.hackathon.management.entity.*;
import com.hackathon.management.repository.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.MigrationInfo;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class DatabaseSchemaIntegrationTest {

    @Autowired(required = false)
    private Flyway flyway;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private TeamMemberRepository teamMemberRepository;

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

    @Test
    @Order(1)
    @DisplayName("1. Flyway migrations execute successfully from scratch (V1 to V7)")
    void test01_flywayMigrationsExecutedSuccessfully() {
        assertNotNull(flyway, "Flyway bean must be present in Spring Context");
        MigrationInfo[] appliedMigrations = flyway.info().applied();
        assertTrue(appliedMigrations.length >= 7, "All 7 Flyway migrations must be executed successfully");

        for (MigrationInfo info : appliedMigrations) {
            assertEquals("SUCCESS", info.getState().name(), "Migration " + info.getScript() + " must have state SUCCESS");
        }
    }

    @Test
    @Order(2)
    @DisplayName("2. Hibernate validation succeeds with ddl-auto=validate across all 10 domain JPA entities")
    void test02_hibernateSchemaValidationSucceeds() {
        assertNotNull(entityManager, "EntityManager must be initialized under ddl-auto=validate");
        
        Set<jakarta.persistence.metamodel.EntityType<?>> entities = entityManager.getMetamodel().getEntities();
        assertTrue(entities.stream().anyMatch(e -> e.getName().equals("User")));
        assertTrue(entities.stream().anyMatch(e -> e.getName().equals("Role")));
        assertTrue(entities.stream().anyMatch(e -> e.getName().equals("Team")));
        assertTrue(entities.stream().anyMatch(e -> e.getName().equals("TeamMember")));
        assertTrue(entities.stream().anyMatch(e -> e.getName().equals("Hackathon")));
        assertTrue(entities.stream().anyMatch(e -> e.getName().equals("HackathonRegistration")));
        assertTrue(entities.stream().anyMatch(e -> e.getName().equals("Submission")));
        assertTrue(entities.stream().anyMatch(e -> e.getName().equals("Evaluation")));
        assertTrue(entities.stream().anyMatch(e -> e.getName().equals("Announcement")));
    }

    @Test
    @Order(3)
    @Transactional
    @DisplayName("3. Multi-hackathon architecture: A persistent team can register for multiple distinct hackathons")
    void test03_teamCanRegisterForMultipleDistinctHackathons() {
        User organizer = userRepository.findByEmail("organizer@grid.dev").orElseThrow();
        User lead = userRepository.findByEmail("chirantan@grid.dev").orElseThrow();

        // 1. Create a persistent team
        Team multiTeam = new Team("Omni Coders", "OMNI-2026", "A persistent multi-event squad", lead);
        multiTeam = teamRepository.saveAndFlush(multiTeam);

        // 2. Create two distinct hackathons
        LocalDateTime now = LocalDateTime.now();
        Hackathon h1 = new Hackathon(organizer, "AI Global Sprint", "Sprint 1", "AI", HackathonMode.ONLINE,
                now, now.plusDays(10), now.plusDays(15), now.plusDays(17));
        h1 = hackathonRepository.saveAndFlush(h1);

        Hackathon h2 = new Hackathon(organizer, "Cloud Native Summit", "Summit 2", "Cloud", HackathonMode.HYBRID,
                now, now.plusDays(20), now.plusDays(25), now.plusDays(27));
        h2 = hackathonRepository.saveAndFlush(h2);

        // 3. Register team to both hackathons
        HackathonRegistration reg1 = new HackathonRegistration(h1, multiTeam);
        HackathonRegistration reg2 = new HackathonRegistration(h2, multiTeam);

        registrationRepository.saveAndFlush(reg1);
        registrationRepository.saveAndFlush(reg2);

        // 4. Verify registrations
        var teamRegistrations = registrationRepository.findByTeamId(multiTeam.getId());
        assertEquals(2, teamRegistrations.size(), "Team must have 2 distinct hackathon registrations");
    }

    @Test
    @Order(4)
    @Transactional
    @DisplayName("4. Relational integrity: A team cannot register for the same hackathon twice (uk_hackathon_team)")
    void test04_teamCannotRegisterForSameHackathonTwice() {
        User organizer = userRepository.findByEmail("organizer@grid.dev").orElseThrow();
        User lead = userRepository.findByEmail("aarav@grid.dev").orElseThrow();

        Team team = new Team("Duplicate Test Team", "DUP-HACK-01", "Testing duplicate protection", lead);
        team = teamRepository.saveAndFlush(team);

        LocalDateTime now = LocalDateTime.now();
        Hackathon hackathon = new Hackathon(organizer, "Unique Registration Cup", "Desc", "Web", HackathonMode.ONLINE,
                now, now.plusDays(5), now.plusDays(10), now.plusDays(12));
        hackathon = hackathonRepository.saveAndFlush(hackathon);

        // First registration succeeds
        HackathonRegistration reg1 = new HackathonRegistration(hackathon, team);
        registrationRepository.saveAndFlush(reg1);

        // Second registration must fail unique constraint
        HackathonRegistration reg2 = new HackathonRegistration(hackathon, team);
        assertThrows(DataIntegrityViolationException.class, () -> {
            registrationRepository.saveAndFlush(reg2);
        }, "Duplicate registration of same team to same hackathon must violate unique constraint uk_hackathon_team");
    }

    @Test
    @Order(5)
    @Transactional
    @DisplayName("5. Relational integrity: A user cannot join the same team twice (uk_team_member)")
    void test05_userCannotJoinSameTeamTwice() {
        User lead = userRepository.findByEmail("chirantan@grid.dev").orElseThrow();
        User member = userRepository.findByEmail("aarav@grid.dev").orElseThrow();

        Team team = new Team("Unique Membership Team", "UNQ-MEM-01", "Testing membership uniqueness", lead);
        team = teamRepository.saveAndFlush(team);

        // First membership succeeds
        TeamMember m1 = new TeamMember(team, member, "DEVELOPER");
        teamMemberRepository.saveAndFlush(m1);

        // Second membership must violate uk_team_member
        TeamMember m2 = new TeamMember(team, member, "DESIGNER");
        assertThrows(DataIntegrityViolationException.class, () -> {
            teamMemberRepository.saveAndFlush(m2);
        }, "Duplicate membership of same user in same team must violate unique constraint uk_team_member");
    }

    @Test
    @Order(6)
    @Transactional
    @DisplayName("6. Submission correctly associated with a hackathon registration")
    void test06_submissionCorrectlyAssociatedWithRegistration() {
        User organizer = userRepository.findByEmail("organizer@grid.dev").orElseThrow();
        User lead = userRepository.findByEmail("chirantan@grid.dev").orElseThrow();

        Team team = new Team("Submission Team", "SUB-TEAM-01", "Project Builders", lead);
        team = teamRepository.saveAndFlush(team);

        LocalDateTime now = LocalDateTime.now();
        Hackathon hackathon = new Hackathon(organizer, "Submission Showcase", "Showcase", "FinTech", HackathonMode.ONLINE,
                now, now.plusDays(5), now.plusDays(10), now.plusDays(12));
        hackathon = hackathonRepository.saveAndFlush(hackathon);

        HackathonRegistration registration = new HackathonRegistration(hackathon, team);
        registration = registrationRepository.saveAndFlush(registration);

        Submission submission = new Submission(registration, "AI Fraud Guardian", "Real-time fraudulent transaction detector");
        submission.setGithubUrl("https://github.com/grid/fraud-guardian");
        submission.setDemoUrl("https://fraud-guardian.demo.grid.dev");
        submission.setSubmissionStatus(SubmissionStatus.SUBMITTED);
        submission = submissionRepository.saveAndFlush(submission);

        Optional<Submission> retrieved = submissionRepository.findByRegistrationId(registration.getId());
        assertTrue(retrieved.isPresent());
        assertEquals("AI Fraud Guardian", retrieved.get().getProjectTitle());
        assertEquals(SubmissionStatus.SUBMITTED, retrieved.get().getSubmissionStatus());
        assertEquals(registration.getId(), retrieved.get().getRegistration().getId());
    }

    @Test
    @Order(7)
    @Transactional
    @DisplayName("7. Evaluation correctly references submission and evaluator with multi-criteria scores")
    void test07_evaluationCorrectlyReferencesSubmissionAndEvaluator() {
        User organizer = userRepository.findByEmail("organizer@grid.dev").orElseThrow();
        User superAdmin = userRepository.findByEmail("superadmin@grid.dev").orElseThrow();

        Team team = new Team("Eval Team", "EVL-TEAM-01", "Evaluated Team", organizer);
        team = teamRepository.saveAndFlush(team);

        LocalDateTime now = LocalDateTime.now();
        Hackathon hackathon = new Hackathon(organizer, "Evaluation Hackathon", "Testing evaluations", "AI", HackathonMode.ONLINE,
                now, now.plusDays(5), now.plusDays(10), now.plusDays(12));
        hackathon = hackathonRepository.saveAndFlush(hackathon);

        HackathonRegistration registration = new HackathonRegistration(hackathon, team);
        registration = registrationRepository.saveAndFlush(registration);

        Submission submission = new Submission(registration, "Smart Contract Auditor", "Automated formal verification engine");
        submission = submissionRepository.saveAndFlush(submission);

        Evaluation eval = new Evaluation(submission, superAdmin, 95, 90, 85, 92, BigDecimal.valueOf(90.50), "Outstanding technical implementation");
        eval = evaluationRepository.saveAndFlush(eval);

        assertNotNull(eval.getId());
        assertEquals(superAdmin.getId(), eval.getEvaluator().getId());
        assertEquals(submission.getId(), eval.getSubmission().getId());
        assertEquals(95, eval.getInnovationScore());
        assertEquals(BigDecimal.valueOf(90.50), eval.getTotalScore());
    }

    @Test
    @Order(8)
    @Transactional
    @DisplayName("8. Relational integrity: Duplicate evaluation by same evaluator on same submission fails (uk_submission_evaluator)")
    void test08_duplicateEvaluationBySameEvaluatorOnSameSubmissionFails() {
        User organizer = userRepository.findByEmail("organizer@grid.dev").orElseThrow();
        User evaluator = userRepository.findByEmail("superadmin@grid.dev").orElseThrow();

        Team team = new Team("Duplicate Eval Team", "DUP-EVL-01", "Desc", organizer);
        team = teamRepository.saveAndFlush(team);

        LocalDateTime now = LocalDateTime.now();
        Hackathon hackathon = new Hackathon(organizer, "Duplicate Eval Hack", "Desc", "AI", HackathonMode.ONLINE,
                now, now.plusDays(5), now.plusDays(10), now.plusDays(12));
        hackathon = hackathonRepository.saveAndFlush(hackathon);

        HackathonRegistration reg = new HackathonRegistration(hackathon, team);
        reg = registrationRepository.saveAndFlush(reg);

        Submission submission = new Submission(reg, "Project Alpha", "Description");
        submission = submissionRepository.saveAndFlush(submission);

        Evaluation eval1 = new Evaluation(submission, evaluator, 80, 80, 80, 80, BigDecimal.valueOf(80.00), "First scoring");
        evaluationRepository.saveAndFlush(eval1);

        Evaluation eval2 = new Evaluation(submission, evaluator, 90, 90, 90, 90, BigDecimal.valueOf(90.00), "Second duplicate scoring");
        assertThrows(DataIntegrityViolationException.class, () -> {
            evaluationRepository.saveAndFlush(eval2);
        }, "Duplicate evaluation by same evaluator on same submission must violate uk_submission_evaluator");
    }

    @Test
    @Order(9)
    @Transactional
    @DisplayName("9. Cascade integrity: Deleting a hackathon cascades to registrations and submissions")
    void test09_deletingHackathonCascadesToRegistrationsAndSubmissions() {
        User organizer = userRepository.findByEmail("organizer@grid.dev").orElseThrow();
        User lead = userRepository.findByEmail("chirantan@grid.dev").orElseThrow();

        Team team = new Team("Cascade Team", "CAS-TEAM-01", "Testing cascading delete", lead);
        team = teamRepository.saveAndFlush(team);

        LocalDateTime now = LocalDateTime.now();
        Hackathon hackathon = new Hackathon(organizer, "Ephemeral Hackathon", "Will be deleted", "Security", HackathonMode.OFFLINE,
                now, now.plusDays(5), now.plusDays(10), now.plusDays(12));
        hackathon = hackathonRepository.saveAndFlush(hackathon);
        Long hackathonId = hackathon.getId();

        HackathonRegistration registration = new HackathonRegistration(hackathon, team);
        registration = registrationRepository.saveAndFlush(registration);
        Long registrationId = registration.getId();

        Submission submission = new Submission(registration, "Ephemeral Project", "Project will be deleted");
        submission = submissionRepository.saveAndFlush(submission);
        Long submissionId = submission.getId();

        Announcement announcement = new Announcement(hackathon, organizer, "Kickoff Update", "Welcome everyone", AnnouncementPriority.NORMAL);
        announcement = announcementRepository.saveAndFlush(announcement);
        Long announcementId = announcement.getId();

        // Delete the hackathon
        hackathonRepository.delete(hackathon);
        hackathonRepository.flush();
        entityManager.clear();

        // Verify hackathon is deleted
        assertFalse(hackathonRepository.findById(hackathonId).isPresent());

        // Verify child records cascaded in DB
        assertFalse(registrationRepository.findById(registrationId).isPresent(), "Registration must be cascade deleted");
        assertFalse(submissionRepository.findById(submissionId).isPresent(), "Submission must be cascade deleted");
        assertFalse(announcementRepository.findById(announcementId).isPresent(), "Announcement must be cascade deleted");

        // Verify Team and User were NOT deleted
        assertTrue(teamRepository.findById(team.getId()).isPresent(), "Team must remain intact");
        assertTrue(userRepository.findById(organizer.getId()).isPresent(), "Organizer user must remain intact");
    }

    @Test
    @Order(10)
    @Transactional
    @DisplayName("10. Foreign key constraints reject orphan child records")
    void test10_foreignKeyConstraintsRejectOrphanChildRecords() {
        User lead = userRepository.findByEmail("chirantan@grid.dev").orElseThrow();
        Team team = new Team("Orphan Test Team", "ORPHAN-01", "Desc", lead);
        team = teamRepository.saveAndFlush(team);

        // Create detached/nonexistent hackathon reference
        Hackathon phantomHackathon = new Hackathon();
        phantomHackathon.setId(999999L);

        HackathonRegistration orphanReg = new HackathonRegistration(phantomHackathon, team);

        assertThrows(DataIntegrityViolationException.class, () -> {
            registrationRepository.saveAndFlush(orphanReg);
        }, "Orphan registration referencing non-existent hackathon must be rejected by foreign key constraint");
    }

    @Test
    @Order(11)
    @Transactional(readOnly = true)
    @DisplayName("11. Seed users can be loaded and have correct roles and BCrypt hashes")
    void test11_seedUsersCanBeLoadedAndHaveCorrectRoles() {
        // Super Admin
        User superAdmin = userRepository.findByEmail("superadmin@grid.dev")
                .orElseThrow(() -> new AssertionError("superadmin@grid.dev not found"));
        assertEquals("Super Administrator", superAdmin.getFullName());
        assertTrue(superAdmin.getIsActive());
        assertTrue(superAdmin.getPasswordHash().startsWith("$2a$"), "Password hash must be BCrypt");
        assertTrue(superAdmin.getRoles().stream().anyMatch(r -> r.getName() == RoleName.SUPER_ADMIN), "Must have SUPER_ADMIN role");

        // Organizer
        User organizer = userRepository.findByEmail("organizer@grid.dev")
                .orElseThrow(() -> new AssertionError("organizer@grid.dev not found"));
        assertEquals("VIT Events Coordinator", organizer.getFullName());
        assertTrue(organizer.getRoles().stream().anyMatch(r -> r.getName() == RoleName.ORGANIZER), "Must have ORGANIZER role");

        // Team User 1
        User user1 = userRepository.findByEmail("chirantan@grid.dev")
                .orElseThrow(() -> new AssertionError("chirantan@grid.dev not found"));
        assertEquals("Chirantan Tondale", user1.getFullName());
        assertTrue(user1.getRoles().stream().anyMatch(r -> r.getName() == RoleName.TEAM), "Must have TEAM role");

        // Team User 2
        User user2 = userRepository.findByEmail("aarav@grid.dev")
                .orElseThrow(() -> new AssertionError("aarav@grid.dev not found"));
        assertEquals("Aarav Deshmukh", user2.getFullName());
        assertTrue(user2.getRoles().stream().anyMatch(r -> r.getName() == RoleName.TEAM), "Must have TEAM role");
    }
}
