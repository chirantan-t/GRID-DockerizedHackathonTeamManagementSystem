package com.hackathon.management.repository;

import com.hackathon.management.entity.Hackathon;
import com.hackathon.management.entity.HackathonStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HackathonRepository extends JpaRepository<Hackathon, Long> {
    List<Hackathon> findByStatus(HackathonStatus status);
    List<Hackathon> findByOrganizerId(Long organizerId);
    List<Hackathon> findByCategory(String category);
    long countByStatus(HackathonStatus status);
    long countByOrganizerId(Long organizerId);
    long countByOrganizerIdAndStatus(Long organizerId, HackathonStatus status);
    List<Hackathon> findTop5ByOrderByCreatedAtDesc();
    List<Hackathon> findTop5ByOrganizerIdOrderByCreatedAtDesc(Long organizerId);

    @Query("SELECT h FROM Hackathon h WHERE " +
           "(:status IS NULL OR h.status = :status) AND " +
           "(:category IS NULL OR LOWER(h.category) = LOWER(:category)) AND " +
           "(:query IS NULL OR LOWER(h.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(h.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Hackathon> searchAndFilter(@Param("status") HackathonStatus status,
                                    @Param("category") String category,
                                    @Param("query") String query);
}
