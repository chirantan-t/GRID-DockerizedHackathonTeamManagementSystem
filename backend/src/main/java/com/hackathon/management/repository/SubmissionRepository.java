package com.hackathon.management.repository;

import com.hackathon.management.entity.Submission;
import com.hackathon.management.entity.SubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    Optional<Submission> findByRegistrationId(Long registrationId);
    boolean existsByRegistrationId(Long registrationId);
    List<Submission> findBySubmissionStatus(SubmissionStatus status);

    @Query("SELECT s FROM Submission s WHERE s.registration.hackathon.id = :hackathonId")
    List<Submission> findByHackathonId(@Param("hackathonId") Long hackathonId);

    @Query("SELECT s FROM Submission s WHERE s.registration.team.id = :teamId")
    List<Submission> findByTeamId(@Param("teamId") Long teamId);

    @Query("SELECT COUNT(s) FROM Submission s WHERE s.registration.hackathon.id = :hackathonId")
    long countByHackathonId(@Param("hackathonId") Long hackathonId);

    @Query("SELECT COUNT(s) FROM Submission s WHERE s.registration.hackathon.organizer.id = :organizerId")
    long countByOrganizerId(@Param("organizerId") Long organizerId);

    @Query("SELECT s FROM Submission s JOIN s.registration.team.members m WHERE m.user.id = :userId")
    List<Submission> findByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(s) FROM Submission s JOIN s.registration.team.members m WHERE m.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);
}
