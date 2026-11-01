-- V5__create_submissions_and_evaluations.sql
-- Purpose: Schema for project submissions linked to registrations, and multi-criteria evaluations.

CREATE TABLE IF NOT EXISTS submissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    registration_id BIGINT NOT NULL UNIQUE,
    project_title VARCHAR(150) NOT NULL,
    project_description TEXT NOT NULL,
    github_url VARCHAR(255),
    demo_url VARCHAR(255),
    presentation_url VARCHAR(255),
    document_url VARCHAR(255),
    submission_status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    submitted_at TIMESTAMP NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_submissions_registration FOREIGN KEY (registration_id) REFERENCES hackathon_registrations(id) ON DELETE CASCADE,
    CONSTRAINT chk_submission_status CHECK (submission_status IN ('DRAFT', 'SUBMITTED')),
    INDEX idx_submissions_status (submission_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS evaluations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    submission_id BIGINT NOT NULL,
    evaluator_id BIGINT NOT NULL,
    innovation_score INT NOT NULL,
    technical_score INT NOT NULL,
    presentation_score INT NOT NULL,
    impact_score INT NOT NULL,
    total_score DECIMAL(5,2) NOT NULL,
    feedback TEXT,
    evaluated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_evaluations_submission FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
    CONSTRAINT fk_evaluations_evaluator FOREIGN KEY (evaluator_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT uk_submission_evaluator UNIQUE (submission_id, evaluator_id),
    CONSTRAINT chk_eval_innovation CHECK (innovation_score >= 0 AND innovation_score <= 100),
    CONSTRAINT chk_eval_technical CHECK (technical_score >= 0 AND technical_score <= 100),
    CONSTRAINT chk_eval_presentation CHECK (presentation_score >= 0 AND presentation_score <= 100),
    CONSTRAINT chk_eval_impact CHECK (impact_score >= 0 AND impact_score <= 100),
    CONSTRAINT chk_eval_total CHECK (total_score >= 0 AND total_score <= 100),
    INDEX idx_evaluations_submission (submission_id),
    INDEX idx_evaluations_evaluator (evaluator_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

