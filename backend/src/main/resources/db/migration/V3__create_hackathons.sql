-- V3__create_hackathons.sql
-- Purpose: Schema for hackathon events created and administered by organizers.

CREATE TABLE IF NOT EXISTS hackathons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    organizer_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    banner_image VARCHAR(255),
    venue VARCHAR(150),
    mode VARCHAR(30) NOT NULL,
    registration_start DATETIME NOT NULL,
    registration_deadline DATETIME NOT NULL,
    event_start DATETIME NOT NULL,
    event_end DATETIME NOT NULL,
    min_team_size INT NOT NULL DEFAULT 1,
    max_team_size INT NOT NULL DEFAULT 4,
    prize_pool VARCHAR(50),
    rules TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_hackathons_organizer FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT chk_hackathon_mode CHECK (mode IN ('ONLINE', 'OFFLINE', 'HYBRID')),
    CONSTRAINT chk_hackathon_status CHECK (status IN ('DRAFT', 'PUBLISHED', 'ONGOING', 'COMPLETED', 'CANCELLED')),
    CONSTRAINT chk_hackathon_team_size CHECK (min_team_size > 0 AND max_team_size >= min_team_size),
    CONSTRAINT chk_hackathon_dates CHECK (registration_start <= registration_deadline AND registration_deadline <= event_start AND event_start <= event_end),
    INDEX idx_hackathons_organizer (organizer_id),
    INDEX idx_hackathons_status (status),
    INDEX idx_hackathons_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

