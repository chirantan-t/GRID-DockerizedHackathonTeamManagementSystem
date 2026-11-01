package com.hackathon.management.repository;

import com.hackathon.management.entity.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    List<Evaluation> findBySubmissionId(Long submissionId);
    Optional<Evaluation> findBySubmissionIdAndEvaluatorId(Long submissionId, Long evaluatorId);
    boolean existsBySubmissionIdAndEvaluatorId(Long submissionId, Long evaluatorId);
    List<Evaluation> findByEvaluatorId(Long evaluatorId);
    long countBySubmissionId(Long submissionId);

    @Query("SELECT AVG(e.totalScore) FROM Evaluation e WHERE e.submission.id = :submissionId")
    Double findAverageTotalScoreBySubmissionId(@Param("submissionId") Long submissionId);

    @Query("SELECT AVG(e.innovationScore), AVG(e.technicalScore), AVG(e.presentationScore), AVG(e.impactScore), AVG(e.totalScore) FROM Evaluation e WHERE e.submission.id = :submissionId")
    List<Object[]> getEvaluationAveragesBySubmissionId(@Param("submissionId") Long submissionId);
}
