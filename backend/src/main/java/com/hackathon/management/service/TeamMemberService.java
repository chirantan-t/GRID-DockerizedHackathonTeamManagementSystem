package com.hackathon.management.service;

import com.hackathon.management.dto.TeamMemberDto;
import com.hackathon.management.dto.TeamMemberRequest;
import com.hackathon.management.entity.Team;
import com.hackathon.management.entity.TeamMember;
import com.hackathon.management.exception.DuplicateResourceException;
import com.hackathon.management.exception.ResourceNotFoundException;
import com.hackathon.management.repository.TeamMemberRepository;
import com.hackathon.management.repository.TeamRepository;
import com.hackathon.management.exception.UnauthorizedActionException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TeamMemberService {

    private final TeamMemberRepository memberRepository;
    private final TeamRepository teamRepository;
    private final com.hackathon.management.repository.UserRepository userRepository;

    public TeamMemberService(TeamMemberRepository memberRepository,
                             TeamRepository teamRepository,
                             com.hackathon.management.repository.UserRepository userRepository) {
        this.memberRepository = memberRepository;
        this.teamRepository = teamRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<TeamMemberDto> getMembersByTeamId(Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + teamId));
        validateTeamLeadAccess(team);

        return memberRepository.findByTeamId(teamId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public TeamMemberDto addMember(Long teamId, TeamMemberRequest request) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + teamId));
        validateTeamLeadAccess(team);

        String email = request.getEmail().trim().toLowerCase();
        boolean alreadyEnrolled = memberRepository.findByTeamId(teamId).stream()
                .anyMatch(m -> email.equalsIgnoreCase(m.getEmail()));
        if (alreadyEnrolled) {
            throw new DuplicateResourceException("Member with email '" + email + "' is already enrolled in this team");
        }

        com.hackathon.management.entity.User memberUser = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    com.hackathon.management.entity.User newUser = new com.hackathon.management.entity.User();
                    newUser.setFullName(request.getFullName().trim());
                    newUser.setEmail(email);
                    newUser.setPasswordHash("$2a$10$BjQ8IRnzrVWHBZ/xvWatsODgZHdMv5KVfbA.YO2rcHkCJFfXaWpFO");
                    newUser.setIsActive(true);
                    return userRepository.save(newUser);
                });

        TeamMember member = new TeamMember(
                request.getFullName().trim(),
                email,
                request.getCollege().trim(),
                request.getDepartment().trim(),
                request.getTeamRole()
        );
        member.setUser(memberUser);
        member.setTeam(team);
        TeamMember saved = memberRepository.save(member);
        return convertToDto(saved);
    }

    public TeamMemberDto updateMember(Long teamId, Long memberId, TeamMemberRequest request) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + teamId));
        validateTeamLeadAccess(team);

        TeamMember member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with ID: " + memberId));

        if (!member.getTeam().getId().equals(teamId)) {
            throw new ResourceNotFoundException("Member ID " + memberId + " does not belong to team " + teamId);
        }

        String email = request.getEmail().trim().toLowerCase();
        boolean emailTaken = memberRepository.findByTeamId(teamId).stream()
                .anyMatch(m -> !m.getId().equals(memberId) && email.equalsIgnoreCase(m.getEmail()));
        if (emailTaken) {
            throw new DuplicateResourceException("Member with email '" + email + "' is already enrolled in this team");
        }

        member.setFullName(request.getFullName().trim());
        member.setEmail(email);
        member.setCollege(request.getCollege().trim());
        member.setDepartment(request.getDepartment().trim());
        member.setTeamRole(request.getTeamRole());

        TeamMember updated = memberRepository.save(member);
        return convertToDto(updated);
    }

    public void deleteMember(Long teamId, Long memberId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + teamId));
        validateTeamLeadAccess(team);

        TeamMember member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with ID: " + memberId));

        if (!member.getTeam().getId().equals(teamId)) {
            throw new ResourceNotFoundException("Member ID " + memberId + " does not belong to team " + teamId);
        }

        memberRepository.delete(member);
    }

    private void validateTeamLeadAccess(Team team) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            return;
        }
        boolean isLeadOnly = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_TEAM_LEAD") || a.getAuthority().equals("ROLE_TEAM")) &&
                auth.getAuthorities().stream()
                .noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_SUPER_ADMIN") || a.getAuthority().equals("ROLE_ORGANIZER"));

        if (isLeadOnly && !auth.getName().equalsIgnoreCase(team.getTeamLead())) {
            throw new UnauthorizedActionException("You are only permitted to manage members of your own team: " + team.getTeamLead());
        }
    }

    private TeamMemberDto convertToDto(TeamMember member) {
        return new TeamMemberDto(
                member.getId(),
                member.getTeam().getId(),
                member.getFullName(),
                member.getEmail(),
                member.getCollege(),
                member.getDepartment(),
                member.getTeamRole(),
                member.getCreatedAt()
        );
    }
}
