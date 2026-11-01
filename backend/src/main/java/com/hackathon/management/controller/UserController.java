package com.hackathon.management.controller;

import com.hackathon.management.dto.ApiResponse;
import com.hackathon.management.dto.UserProfileUpdateRequest;
import com.hackathon.management.dto.UserResponseDto;
import com.hackathon.management.dto.UserStatusUpdateRequest;
import com.hackathon.management.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponseDto>> getProfile(Authentication authentication) {
        String email = authentication.getName();
        UserResponseDto profile = userService.getProfile(email);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponseDto>> updateProfile(
            @Valid @RequestBody UserProfileUpdateRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        UserResponseDto updated = userService.updateProfile(email, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<UserResponseDto>> updateUserStatus(
            @PathVariable Long id,
            @Valid @RequestBody UserStatusUpdateRequest request) {
        UserResponseDto updated = userService.updateUserStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("User status updated successfully", updated));
    }
}

