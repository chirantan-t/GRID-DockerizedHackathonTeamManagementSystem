package com.hackathon.management.repository;

import com.hackathon.management.entity.Announcement;
import com.hackathon.management.entity.AnnouncementPriority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findByHackathonId(Long hackathonId);
    List<Announcement> findByHackathonIdOrderByPublishedAtDesc(Long hackathonId);
    List<Announcement> findByHackathonIdAndPriority(Long hackathonId, AnnouncementPriority priority);
    List<Announcement> findByAuthorId(Long authorId);
    List<Announcement> findTop5ByHackathonIdOrderByPublishedAtDesc(Long hackathonId);

    @Query("SELECT DISTINCT a FROM Announcement a JOIN a.hackathon.registrations r JOIN r.team.members m WHERE m.user.id = :userId ORDER BY a.publishedAt DESC")
    List<Announcement> findByTeamUserId(@Param("userId") Long userId);
}
