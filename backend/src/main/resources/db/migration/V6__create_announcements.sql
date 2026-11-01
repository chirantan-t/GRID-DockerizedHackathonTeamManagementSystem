-- V6__create_announcements.sql
-- Purpose: Schema for broadcast announcements published by organizers for hackathons.

CREATE TABLE IF NOT EXISTS announcements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hackathon_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    priority VARCHAR(30) NOT NULL DEFAULT 'NORMAL',
    published_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_announcements_hackathon FOREIGN KEY (hackathon_id) REFERENCES hackathons(id) ON DELETE CASCADE,
    CONSTRAINT fk_announcements_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT chk_announcement_priority CHECK (priority IN ('NORMAL', 'IMPORTANT', 'URGENT')),
    INDEX idx_announcements_hackathon (hackathon_id),
    INDEX idx_announcements_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

