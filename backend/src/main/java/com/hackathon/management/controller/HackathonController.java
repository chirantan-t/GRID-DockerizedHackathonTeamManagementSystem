package com.hackathon.management.controller;

import com.hackathon.management.dto.ApiResponse;
import com.hackathon.management.dto.HackathonCreateRequest;
import com.hackathon.management.dto.HackathonResponseDto;
import com.hackathon.management.dto.HackathonStatusUpdateRequest;
import com.hackathon.management.dto.HackathonUpdateRequest;
import com.hackathon.management.entity.HackathonStatus;
import com.hackathon.management.entity.User;
import com.hackathon.management.service.HackathonService;
import com.hackathon.management.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hackathons")
public class HackathonController {

    private final HackathonService hackathonService;
    private final UserService userService;

    public HackathonController(HackathonService hackathonService, UserService userService) {
        this.hackathonService = hackathonService;
        this.userService = userService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ORGANIZER', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<HackathonResponseDto>> createHackathon(
            @Valid @RequestBody HackathonCreateRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        HackathonResponseDto created = hackathonService.createHackathon(request, email);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Hackathon created successfully", created));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<HackathonResponseDto>>> getHackathons(
            @RequestParam(required = false) HackathonStatus status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String query) {
        List<HackathonResponseDto> list = hackathonService.searchAndFilter(status, category, query);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/published")
    public ResponseEntity<ApiResponse<List<HackathonResponseDto>>> getPublishedHackathons() {
        List<HackathonResponseDto> list = hackathonService.listPublishedHackathons();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<HackathonResponseDto>>> getMyHackathons(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        List<HackathonResponseDto> list = hackathonService.getOrganizerHackathons(user.getId());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HackathonResponseDto>> getHackathonById(@PathVariable Long id) {
        HackathonResponseDto hackathon = hackathonService.getHackathonById(id);
        return ResponseEntity.ok(ApiResponse.success(hackathon));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<HackathonResponseDto>> updateHackathon(
            @PathVariable Long id,
            @Valid @RequestBody HackathonUpdateRequest request,
            Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));
        HackathonResponseDto updated = hackathonService.updateHackathon(id, request, authentication.getName(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Hackathon updated successfully", updated));
    }

    @PostMapping("/{id}/publish")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<HackathonResponseDto>> publishHackathon(
            @PathVariable Long id,
            Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));
        HackathonResponseDto published = hackathonService.publishHackathon(id, authentication.getName(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Hackathon published successfully", published));
    }

    @PostMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<HackathonResponseDto>> updateHackathonStatus(
            @PathVariable Long id,
            @Valid @RequestBody HackathonStatusUpdateRequest request,
            Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));
        HackathonResponseDto updated = hackathonService.updateStatus(id, request.getStatus(), authentication.getName(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Hackathon status updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteHackathon(
            @PathVariable Long id,
            Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));
        hackathonService.deleteHackathon(id, authentication.getName(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Hackathon deleted successfully", null));
    }
}

