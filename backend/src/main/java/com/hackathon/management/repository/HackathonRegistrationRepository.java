package com.hackathon.management.repository;

import com.hackathon.management.entity.HackathonRegistration;
import com.hackathon.management.entity.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HackathonRegistrationRepository extends JpaRepository<HackathonRegistration, Long> {
    List<HackathonRegistration> findByHackathonId(Long hackathonId);
    List<HackathonRegistration> findByTeamId(Long teamId);
    Optional<HackathonRegistration> findByHackathonIdAndTeamId(Long hackathonId, Long teamId);
    boolean existsByHackathonIdAndTeamId(Long hackathonId, Long teamId);
    long countByHackathonId(Long hackathonId);
    long countByHackathonIdAndRegistrationStatus(Long hackathonId, RegistrationStatus registrationStatus);
    long countByRegistrationStatus(RegistrationStatus registrationStatus);

    List<HackathonRegistration> findByHackathonOrganizerId(Long organizerId);
    long countByHackathonOrganizerId(Long organizerId);
    List<HackathonRegistration> findTop5ByHackathonOrganizerIdOrderByRegisteredAtDesc(Long organizerId);

    @Query("SELECT DISTINCT r FROM HackathonRegistration r LEFT JOIN r.team.members m WHERE m.user.id = :userId OR r.team.createdBy.id = :userId")
    List<HackathonRegistration> findByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(DISTINCT r.hackathon.id) FROM HackathonRegistration r LEFT JOIN r.team.members m WHERE m.user.id = :userId OR r.team.createdBy.id = :userId")
    long countDistinctHackathonsByUserId(@Param("userId") Long userId);
}
