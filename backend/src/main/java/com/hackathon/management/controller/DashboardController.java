package com.hackathon.management.controller;

import com.hackathon.management.dto.*;
import com.hackathon.management.entity.User;
import com.hackathon.management.service.DashboardService;
import com.hackathon.management.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final UserService userService;

    public DashboardController(DashboardService dashboardService, UserService userService) {
        this.dashboardService = dashboardService;
        this.userService = userService;
    }

    @GetMapping("/team")
    @PreAuthorize("hasAnyRole('TEAM', 'TEAM_LEAD', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<TeamDashboardDto>> getTeamDashboard(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        TeamDashboardDto dashboard = dashboardService.getTeamDashboard(user.getId());
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }

    @GetMapping("/organizer")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<OrganizerDashboardDto>> getOrganizerDashboard(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        OrganizerDashboardDto dashboard = dashboardService.getOrganizerDashboard(user.getId());
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<AdminDashboardDto>> getAdminDashboard() {
        AdminDashboardDto dashboard = dashboardService.getAdminDashboard();
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDto> getSummary() {
        DashboardSummaryDto summary = dashboardService.getSummary();
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/status-distribution")
    public ResponseEntity<List<StatusDistributionDto>> getStatusDistribution() {
        List<StatusDistributionDto> distribution = dashboardService.getStatusDistribution();
        return ResponseEntity.ok(distribution);
    }

    @GetMapping("/track-distribution")
    public ResponseEntity<List<TrackDistributionDto>> getTrackDistribution() {
        List<TrackDistributionDto> distribution = dashboardService.getTrackDistribution();
        return ResponseEntity.ok(distribution);
    }
}
