-- V4__create_hackathon_registrations.sql
-- Purpose: Connects persistent teams to individual hackathons, enabling teams to join multiple hackathons.

CREATE TABLE IF NOT EXISTS hackathon_registrations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hackathon_id BIGINT NOT NULL,
    team_id BIGINT NOT NULL,
    registration_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_registrations_hackathon FOREIGN KEY (hackathon_id) REFERENCES hackathons(id) ON DELETE CASCADE,
    CONSTRAINT fk_registrations_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    CONSTRAINT uk_hackathon_team UNIQUE (hackathon_id, team_id),
    CONSTRAINT chk_registration_status CHECK (registration_status IN ('PENDING', 'APPROVED', 'REJECTED', 'WITHDRAWN')),
    INDEX idx_reg_hackathon (hackathon_id),
    INDEX idx_reg_team (team_id),
    INDEX idx_reg_status (registration_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

