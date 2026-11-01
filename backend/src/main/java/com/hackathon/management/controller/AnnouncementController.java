package com.hackathon.management.controller;

import com.hackathon.management.dto.AnnouncementCreateRequest;
import com.hackathon.management.dto.AnnouncementResponseDto;
import com.hackathon.management.dto.AnnouncementUpdateRequest;
import com.hackathon.management.dto.ApiResponse;
import com.hackathon.management.entity.User;
import com.hackathon.management.service.AnnouncementService;
import com.hackathon.management.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    private final AnnouncementService announcementService;
    private final UserService userService;

    public AnnouncementController(AnnouncementService announcementService, UserService userService) {
        this.announcementService = announcementService;
        this.userService = userService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ORGANIZER', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<AnnouncementResponseDto>> createAnnouncement(
            @Valid @RequestBody AnnouncementCreateRequest request,
            Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));
        AnnouncementResponseDto created = announcementService.createAnnouncement(request, authentication.getName(), isAdmin);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Announcement published successfully", created));
    }

    @GetMapping("/hackathon/{hackathonId}")
    public ResponseEntity<ApiResponse<List<AnnouncementResponseDto>>> getAnnouncementsByHackathon(@PathVariable Long hackathonId) {
        List<AnnouncementResponseDto> list = announcementService.getAnnouncementsByHackathon(hackathonId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<AnnouncementResponseDto>>> getMyAnnouncements(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        List<AnnouncementResponseDto> list = announcementService.getAnnouncementsForUser(user.getId());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<AnnouncementResponseDto>> updateAnnouncement(
            @PathVariable Long id,
            @Valid @RequestBody AnnouncementUpdateRequest request,
            Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));
        AnnouncementResponseDto updated = announcementService.updateAnnouncement(id, request, authentication.getName(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Announcement updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteAnnouncement(
            @PathVariable Long id,
            Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));
        announcementService.deleteAnnouncement(id, authentication.getName(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Announcement deleted successfully", null));
    }
}

