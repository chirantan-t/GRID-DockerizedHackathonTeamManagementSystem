package com.hackathon.management.service;

import com.hackathon.management.dto.AnnouncementCreateRequest;
import com.hackathon.management.dto.AnnouncementResponseDto;
import com.hackathon.management.dto.AnnouncementUpdateRequest;
import com.hackathon.management.entity.Announcement;
import com.hackathon.management.entity.AnnouncementPriority;
import com.hackathon.management.entity.Hackathon;
import com.hackathon.management.entity.User;
import com.hackathon.management.exception.ResourceNotFoundException;
import com.hackathon.management.exception.UnauthorizedActionException;
import com.hackathon.management.repository.AnnouncementRepository;
import com.hackathon.management.repository.HackathonRepository;
import com.hackathon.management.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final HackathonRepository hackathonRepository;
    private final UserRepository userRepository;

    public AnnouncementService(AnnouncementRepository announcementRepository,
                               HackathonRepository hackathonRepository,
                               UserRepository userRepository) {
        this.announcementRepository = announcementRepository;
        this.hackathonRepository = hackathonRepository;
        this.userRepository = userRepository;
    }

    public AnnouncementResponseDto createAnnouncement(AnnouncementCreateRequest request, String authorEmail, boolean isAdmin) {
        Hackathon hackathon = hackathonRepository.findById(request.getHackathonId())
                .orElseThrow(() -> new ResourceNotFoundException("Hackathon not found with ID: " + request.getHackathonId()));

        User author = userRepository.findByEmail(authorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Author not found: " + authorEmail));

        if (!isAdmin && (hackathon.getOrganizer() == null || !hackathon.getOrganizer().getId().equals(author.getId()))) {
            throw new UnauthorizedActionException("You are only permitted to publish announcements for your own hackathons.");
        }

        AnnouncementPriority priority = request.getPriority() != null ? request.getPriority() : AnnouncementPriority.NORMAL;

        Announcement announcement = new Announcement(
                hackathon,
                author,
                request.getTitle().trim(),
                request.getMessage().trim(),
                priority
        );

        Announcement saved = announcementRepository.save(announcement);
        return mapToDto(saved);
    }

    public AnnouncementResponseDto updateAnnouncement(Long id, AnnouncementUpdateRequest request, String userEmail, boolean isAdmin) {
        Announcement announcement = getAnnouncementEntity(id);

        if (!isAdmin && (announcement.getAuthor() == null || !announcement.getAuthor().getEmail().equalsIgnoreCase(userEmail))) {
            throw new UnauthorizedActionException("You are not authorized to update this announcement.");
        }

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            announcement.setTitle(request.getTitle().trim());
        }
        if (request.getMessage() != null && !request.getMessage().isBlank()) {
            announcement.setMessage(request.getMessage().trim());
        }
        if (request.getPriority() != null) {
            announcement.setPriority(request.getPriority());
        }

        Announcement saved = announcementRepository.save(announcement);
        return mapToDto(saved);
    }

    public void deleteAnnouncement(Long id, String userEmail, boolean isAdmin) {
        Announcement announcement = getAnnouncementEntity(id);

        if (!isAdmin && (announcement.getAuthor() == null || !announcement.getAuthor().getEmail().equalsIgnoreCase(userEmail))) {
            throw new UnauthorizedActionException("You are not authorized to delete this announcement.");
        }

        announcementRepository.delete(announcement);
    }

    @Transactional(readOnly = true)
    public List<AnnouncementResponseDto> getAnnouncementsByHackathon(Long hackathonId) {
        return announcementRepository.findByHackathonIdOrderByPublishedAtDesc(hackathonId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AnnouncementResponseDto> getAnnouncementsForUser(Long userId) {
        return announcementRepository.findByTeamUserId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public Announcement getAnnouncementEntity(Long id) {
        return announcementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement not found with ID: " + id));
    }

    public AnnouncementResponseDto mapToDto(Announcement a) {
        AnnouncementResponseDto dto = new AnnouncementResponseDto();
        dto.setId(a.getId());
        if (a.getHackathon() != null) {
            dto.setHackathonId(a.getHackathon().getId());
            dto.setHackathonTitle(a.getHackathon().getTitle());
        }
        if (a.getAuthor() != null) {
            dto.setAuthorId(a.getAuthor().getId());
            dto.setAuthorName(a.getAuthor().getFullName());
        }
        dto.setTitle(a.getTitle());
        dto.setMessage(a.getMessage());
        dto.setPriority(a.getPriority());
        dto.setPublishedAt(a.getPublishedAt());
        dto.setCreatedAt(a.getCreatedAt());
        dto.setUpdatedAt(a.getUpdatedAt());
        return dto;
    }
}

