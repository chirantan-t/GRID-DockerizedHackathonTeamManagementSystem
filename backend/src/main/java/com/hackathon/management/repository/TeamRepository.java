package com.hackathon.management.repository;

import com.hackathon.management.entity.Team;
import com.hackathon.management.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {

    Optional<Team> findByTeamCode(String teamCode);

    boolean existsByTeamCode(String teamCode);

    List<Team> findByCreatedBy(User createdBy);

    List<Team> findByCreatedById(Long userId);

    @Query("SELECT DISTINCT t FROM Team t LEFT JOIN t.members m WHERE t.createdBy.id = :userId OR m.user.id = :userId")
    List<Team> findAllByUserId(@Param("userId") Long userId);

    @Query("SELECT t FROM Team t WHERE LOWER(t.teamName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(t.teamCode) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Team> searchTeams(@Param("query") String query, Pageable pageable);

    List<Team> findTop5ByOrderByUpdatedAtDesc();
}
