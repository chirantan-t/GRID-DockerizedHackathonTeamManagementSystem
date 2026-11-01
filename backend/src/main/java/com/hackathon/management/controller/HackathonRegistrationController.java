package com.hackathon.management.controller;

import com.hackathon.management.dto.ApiResponse;
import com.hackathon.management.dto.RegistrationCreateRequest;
import com.hackathon.management.dto.RegistrationResponseDto;
import com.hackathon.management.service.HackathonRegistrationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
public class HackathonRegistrationController {

    private final HackathonRegistrationService registrationService;

    public HackathonRegistrationController(HackathonRegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TEAM', 'TEAM_LEAD', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<RegistrationResponseDto>> registerTeam(
            @Valid @RequestBody RegistrationCreateRequest request,
            Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));
        RegistrationResponseDto created = registrationService.registerTeam(request, authentication.getName(), isAdmin);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Team registered for hackathon successfully", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RegistrationResponseDto>> getRegistrationById(@PathVariable Long id) {
        RegistrationResponseDto reg = registrationService.getRegistrationById(id);
        return ResponseEntity.ok(ApiResponse.success(reg));
    }

    @GetMapping("/hackathon/{hackathonId}")
    public ResponseEntity<ApiResponse<List<RegistrationResponseDto>>> getRegistrationsByHackathon(@PathVariable Long hackathonId) {
        List<RegistrationResponseDto> list = registrationService.listRegistrationsByHackathon(hackathonId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<ApiResponse<List<RegistrationResponseDto>>> getRegistrationsByTeam(@PathVariable Long teamId) {
        List<RegistrationResponseDto> list = registrationService.listRegistrationsByTeam(teamId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<RegistrationResponseDto>> approveRegistration(
            @PathVariable Long id,
            Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));
        RegistrationResponseDto approved = registrationService.approveRegistration(id, authentication.getName(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Registration approved successfully", approved));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<RegistrationResponseDto>> rejectRegistration(
            @PathVariable Long id,
            Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));
        RegistrationResponseDto rejected = registrationService.rejectRegistration(id, authentication.getName(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Registration rejected successfully", rejected));
    }

    @PostMapping("/{id}/withdraw")
    @PreAuthorize("hasAnyRole('TEAM', 'TEAM_LEAD', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<RegistrationResponseDto>> withdrawRegistration(
            @PathVariable Long id,
            Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));
        RegistrationResponseDto withdrawn = registrationService.withdrawRegistration(id, authentication.getName(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Registration withdrawn successfully", withdrawn));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<RegistrationResponseDto>> updateRegistrationStatus(
            @PathVariable Long id,
            @Valid @RequestBody com.hackathon.management.dto.RegistrationStatusUpdateRequest request,
            Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));
        RegistrationResponseDto updated;
        if (request.getStatus() == com.hackathon.management.entity.RegistrationStatus.APPROVED) {
            updated = registrationService.approveRegistration(id, authentication.getName(), isAdmin);
        } else if (request.getStatus() == com.hackathon.management.entity.RegistrationStatus.REJECTED) {
            updated = registrationService.rejectRegistration(id, authentication.getName(), isAdmin);
        } else if (request.getStatus() == com.hackathon.management.entity.RegistrationStatus.WITHDRAWN) {
            updated = registrationService.withdrawRegistration(id, authentication.getName(), isAdmin);
        } else {
            updated = registrationService.getRegistrationById(id);
        }
        return ResponseEntity.ok(ApiResponse.success("Registration status updated", updated));
    }
}

