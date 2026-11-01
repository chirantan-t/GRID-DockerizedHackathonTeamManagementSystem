package com.hackathon.management.service;

import com.hackathon.management.dto.RegisterRequest;
import com.hackathon.management.dto.UserProfileUpdateRequest;
import com.hackathon.management.dto.UserResponseDto;
import com.hackathon.management.dto.UserStatusUpdateRequest;
import com.hackathon.management.entity.Role;
import com.hackathon.management.entity.RoleName;
import com.hackathon.management.entity.User;
import com.hackathon.management.exception.DuplicateResourceException;
import com.hackathon.management.exception.ResourceNotFoundException;
import com.hackathon.management.repository.RoleRepository;
import com.hackathon.management.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserResponseDto register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }

        RoleName targetRoleName = RoleName.TEAM;
        if (request.getRole() != null) {
            String cleanRole = request.getRole().toUpperCase().trim();
            if (cleanRole.startsWith("ROLE_")) {
                cleanRole = cleanRole.substring(5);
            }
            try {
                targetRoleName = RoleName.valueOf(cleanRole);
                if (targetRoleName == RoleName.SUPER_ADMIN) {
                    targetRoleName = RoleName.TEAM; // Disallow self-registration as SUPER_ADMIN
                }
            } catch (IllegalArgumentException e) {
                targetRoleName = RoleName.TEAM;
            }
        }

        final RoleName finalRole = targetRoleName;
        Role assignedRole = roleRepository.findByRoleName(finalRole)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + finalRole));

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(request.getEmail().toLowerCase().trim());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setIsActive(true);
        user.addRole(assignedRole);

        User saved = userRepository.save(user);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public UserResponseDto getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        return mapToDto(user);
    }

    @Transactional
    public UserResponseDto updateProfile(String email, UserProfileUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
        }
        if (request.getProfileImage() != null) {
            user.setProfileImage(request.getProfileImage().trim());
        }

        User updated = userRepository.save(user);
        return mapToDto(updated);
    }

    @Transactional
    public UserResponseDto updateUserStatus(Long userId, UserStatusUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setIsActive(request.getIsActive());
        User updated = userRepository.save(user);
        return mapToDto(updated);
    }

    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    public UserResponseDto mapToDto(User user) {
        Set<String> roleNames = user.getRoles().stream()
                .map(r -> r.getRoleName().name())
                .collect(Collectors.toSet());

        return new UserResponseDto(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getProfileImage(),
                user.getIsActive(),
                roleNames,
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
