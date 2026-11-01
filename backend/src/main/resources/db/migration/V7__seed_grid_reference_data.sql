-- V7__seed_grid_reference_data.sql
-- Purpose: Initial reference baseline data for platform roles, verified user accounts, demo hackathons, and registrations.

-- Seed Users (Password for all seeded accounts: Grid@2026)
INSERT INTO users (id, full_name, email, password_hash, is_active) VALUES
(1, 'Super Administrator', 'superadmin@grid.dev', '$2a$10$BjQ8IRnzrVWHBZ/xvWatsODgZHdMv5KVfbA.YO2rcHkCJFfXaWpFO', TRUE),
(2, 'VIT Events Coordinator', 'organizer@grid.dev', '$2a$10$BjQ8IRnzrVWHBZ/xvWatsODgZHdMv5KVfbA.YO2rcHkCJFfXaWpFO', TRUE),
(3, 'Chirantan Tondale', 'chirantan@grid.dev', '$2a$10$BjQ8IRnzrVWHBZ/xvWatsODgZHdMv5KVfbA.YO2rcHkCJFfXaWpFO', TRUE),
(4, 'Aarav Deshmukh', 'aarav@grid.dev', '$2a$10$BjQ8IRnzrVWHBZ/xvWatsODgZHdMv5KVfbA.YO2rcHkCJFfXaWpFO', TRUE)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Map User Roles
-- Role IDs: 1 = TEAM, 2 = ORGANIZER, 3 = SUPER_ADMIN
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 3), -- superadmin -> SUPER_ADMIN
(2, 2), -- organizer -> ORGANIZER
(3, 1), -- chirantan -> TEAM
(4, 1)  -- aarav -> TEAM
ON DUPLICATE KEY UPDATE user_id = VALUES(user_id);

-- Seed Teams
INSERT INTO teams (id, team_name, team_code, description, created_by) VALUES
(1, 'Team Alpha', 'ALPHA-2026', 'AI-driven municipal waste analytics and autonomous routing squad.', 3),
(2, 'Byte Brigade', 'BYTE-2026', 'Peer-to-peer decentralized study network with verifiable credentials.', 4)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Seed Team Members
INSERT INTO team_members (id, team_id, user_id, member_role) VALUES
(1, 1, 3, 'TEAM_LEAD'),
(2, 1, 4, 'DEVELOPER'),
(3, 2, 4, 'TEAM_LEAD')
ON DUPLICATE KEY UPDATE joined_at = CURRENT_TIMESTAMP;

-- Seed Hackathons
INSERT INTO hackathons (id, organizer_id, title, description, category, venue, mode, registration_start, registration_deadline, event_start, event_end, min_team_size, max_team_size, prize_pool, status) VALUES
(1, 2, 'InnovateX 2026', 'A 36-hour national hackathon tackling mission-critical engineering and AI challenges.', 'AI / ML', 'Offline – VIT Auditorium, Mumbai', 'OFFLINE', '2026-11-01 00:00:00', '2026-11-14 23:59:59', '2026-11-15 09:00:00', '2026-11-16 21:00:00', 2, 4, '₹50,000', 'ONGOING'),
(2, 2, 'BuildForGood', 'Dedicated to UN Sustainable Development Goals using generative intelligence and microgrids.', 'Sustainability & IoT', 'Virtual Stage 1', 'ONLINE', '2026-11-05 00:00:00', '2026-11-20 23:59:59', '2026-11-22 09:00:00', '2026-11-23 21:00:00', 2, 5, '₹75,000', 'PUBLISHED')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Seed Registrations (Demonstrating Team 1 in multiple hackathons)
INSERT INTO hackathon_registrations (id, hackathon_id, team_id, registration_status, approved_at) VALUES
(1, 1, 1, 'APPROVED', '2026-11-10 14:30:00'),
(2, 2, 1, 'APPROVED', '2026-11-12 11:15:00'),
(3, 1, 2, 'PENDING', NULL)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Seed Submissions
INSERT INTO submissions (id, registration_id, project_title, project_description, github_url, demo_url, submission_status, submitted_at) VALUES
(1, 1, 'Smart City Waste Management', 'A smart, AI-driven system for efficient urban waste collection and segregation using visual edge telemetry.', 'https://github.com/teamalpha/scwm', 'https://scwm-demo.teamalpha.dev', 'SUBMITTED', '2026-11-15 23:42:00')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Seed Evaluations
INSERT INTO evaluations (id, submission_id, evaluator_id, innovation_score, technical_score, presentation_score, impact_score, total_score, feedback) VALUES
(1, 1, 2, 27, 25, 17, 18, 87.00, 'Exceptional edge inference model and clean containerized deployment workflow.')
ON DUPLICATE KEY UPDATE evaluated_at = CURRENT_TIMESTAMP;

-- Seed Announcements
INSERT INTO announcements (id, hackathon_id, author_id, title, message, priority) VALUES
(1, 1, 2, 'Final Submission Reminder', 'Reminder: The final code repository and video demo submission deadline is tonight at 11:59 PM sharp.', 'URGENT'),
(2, 1, 2, 'Shortlisted Teams Announced', 'The jury has concluded preliminary screening. Top 15 teams are live on the evaluation board.', 'IMPORTANT')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

