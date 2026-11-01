package com.hackathon.management.service;

import com.hackathon.management.dto.*;
import com.hackathon.management.entity.*;
import com.hackathon.management.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository memberRepository;
    private final TeamService teamService;
    private final HackathonRepository hackathonRepository;
    private final HackathonRegistrationRepository registrationRepository;
    private final SubmissionRepository submissionRepository;
    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;
    private final HackathonService hackathonService;
    private final HackathonRegistrationService registrationService;
    private final AnnouncementService announcementService;
    private final UserService userService;

    public DashboardService(TeamRepository teamRepository,
                            TeamMemberRepository memberRepository,
                            TeamService teamService,
                            HackathonRepository hackathonRepository,
                            HackathonRegistrationRepository registrationRepository,
                            SubmissionRepository submissionRepository,
                            AnnouncementRepository announcementRepository,
                            UserRepository userRepository,
                            HackathonService hackathonService,
                            HackathonRegistrationService registrationService,
                            AnnouncementService announcementService,
                            UserService userService) {
        this.teamRepository = teamRepository;
        this.memberRepository = memberRepository;
        this.teamService = teamService;
        this.hackathonRepository = hackathonRepository;
        this.registrationRepository = registrationRepository;
        this.submissionRepository = submissionRepository;
        this.announcementRepository = announcementRepository;
        this.userRepository = userRepository;
        this.hackathonService = hackathonService;
        this.registrationService = registrationService;
        this.announcementService = announcementService;
        this.userService = userService;
    }

    public TeamDashboardDto getTeamDashboard(Long userId) {
        TeamDashboardDto dto = new TeamDashboardDto();

        List<HackathonRegistration> userRegistrations = registrationRepository.findByUserId(userId);
        dto.setRegisteredHackathonsCount(userRegistrations.size());

        long inProgress = userRegistrations.stream()
                .filter(r -> r.getHackathon() != null && r.getHackathon().getStatus() == HackathonStatus.ONGOING)
                .count();
        dto.setInProgressHackathonsCount(inProgress);

        long completed = userRegistrations.stream()
                .filter(r -> r.getHackathon() != null && r.getHackathon().getStatus() == HackathonStatus.COMPLETED)
                .count();
        dto.setCompletedHackathonsCount(completed);

        long activeSubs = submissionRepository.countByUserId(userId);
        dto.setActiveSubmissionsCount(activeSubs);

        List<Team> myTeams = teamRepository.findAllByUserId(userId);
        dto.setMyTeams(myTeams.stream().map(teamService::convertToDto).collect(Collectors.toList()));

        dto.setRegistrations(userRegistrations.stream().map(registrationService::mapToDto).collect(Collectors.toList()));

        List<Announcement> announcements = announcementRepository.findByTeamUserId(userId);
        dto.setRecentAnnouncements(announcements.stream().limit(5).map(announcementService::mapToDto).collect(Collectors.toList()));

        return dto;
    }

    public OrganizerDashboardDto getOrganizerDashboard(Long organizerId) {
        OrganizerDashboardDto dto = new OrganizerDashboardDto();

        dto.setTotalHackathons(hackathonRepository.countByOrganizerId(organizerId));
        dto.setPublishedHackathons(hackathonRepository.countByOrganizerIdAndStatus(organizerId, HackathonStatus.PUBLISHED));
        dto.setOngoingHackathons(hackathonRepository.countByOrganizerIdAndStatus(organizerId, HackathonStatus.ONGOING));
        dto.setTotalRegistrations(registrationRepository.countByHackathonOrganizerId(organizerId));
        dto.setTotalSubmissions(submissionRepository.countByOrganizerId(organizerId));

        List<Hackathon> owned = hackathonRepository.findByOrganizerId(organizerId);
        dto.setOwnedHackathons(owned.stream().map(hackathonService::mapToDto).collect(Collectors.toList()));

        List<HackathonRegistration> recentRegs = registrationRepository.findTop5ByHackathonOrganizerIdOrderByRegisteredAtDesc(organizerId);
        dto.setRecentRegistrations(recentRegs.stream().map(registrationService::mapToDto).collect(Collectors.toList()));

        return dto;
    }

    public AdminDashboardDto getAdminDashboard() {
        AdminDashboardDto dto = new AdminDashboardDto();

        dto.setTotalUsers(userRepository.count());
        dto.setTotalOrganizers(userRepository.countByRoleName(RoleName.ORGANIZER));
        dto.setTotalTeams(teamRepository.count());
        dto.setTotalHackathons(hackathonRepository.count());
        dto.setTotalRegistrations(registrationRepository.count());
        dto.setTotalSubmissions(submissionRepository.count());

        List<User> recentUsers = userRepository.findTop5ByOrderByCreatedAtDesc();
        dto.setRecentUsers(recentUsers.stream().map(userService::mapToDto).collect(Collectors.toList()));

        List<Hackathon> recentHackathons = hackathonRepository.findTop5ByOrderByCreatedAtDesc();
        dto.setRecentHackathons(recentHackathons.stream().map(hackathonService::mapToDto).collect(Collectors.toList()));

        return dto;
    }

    public DashboardSummaryDto getSummary() {
        List<Team> allTeams = teamRepository.findAll();
        if (teamService.isLeadOnly()) {
            String lead = teamService.getCurrentUsername();
            allTeams = allTeams.stream()
                    .filter(t -> lead != null && lead.equalsIgnoreCase(t.getTeamLead()))
                    .collect(Collectors.toList());
        }

        DashboardSummaryDto summary = new DashboardSummaryDto();
        summary.setTotalTeams(allTeams.size());
        summary.setDraftTeams(0);
        summary.setRegisteredTeams(allTeams.stream().filter(t -> t.getRegistrationStatus() == RegistrationStatus.PENDING).count());
        summary.setApprovedTeams(allTeams.stream().filter(t -> t.getRegistrationStatus() == RegistrationStatus.APPROVED).count());
        summary.setInProgressTeams(0);
        summary.setSubmittedTeams(0);
        summary.setCompletedTeams(0);
        summary.setRejectedTeams(allTeams.stream().filter(t -> t.getRegistrationStatus() == RegistrationStatus.REJECTED).count());

        long memberCount = allTeams.stream().mapToLong(t -> t.getMembers() != null ? t.getMembers().size() : 0).sum();
        summary.setTotalMembers(memberCount > 0 ? memberCount : memberRepository.count());

        summary.setRecentTeams(teamRepository.findTop5ByOrderByUpdatedAtDesc().stream()
                .map(teamService::convertToDto)
                .collect(Collectors.toList()));

        return summary;
    }

    public List<StatusDistributionDto> getStatusDistribution() {
        if (teamService.isLeadOnly()) {
            return new ArrayList<>();
        }
        List<Team> allTeams = teamRepository.findAll();
        List<StatusDistributionDto> distribution = new ArrayList<>();
        for (RegistrationStatus status : RegistrationStatus.values()) {
            long count = allTeams.stream().filter(t -> t.getRegistrationStatus() == status).count();
            distribution.add(new StatusDistributionDto(status, formatLabel(status.name()), count));
        }
        return distribution;
    }

    public List<TrackDistributionDto> getTrackDistribution() {
        if (teamService.isLeadOnly()) {
            return new ArrayList<>();
        }
        List<Team> allTeams = teamRepository.findAll();
        List<TrackDistributionDto> distribution = new ArrayList<>();
        for (Track track : Track.values()) {
            long count = allTeams.stream().filter(t -> t.getTrack() == track).count();
            distribution.add(new TrackDistributionDto(track, formatLabel(track.name()), count));
        }
        return distribution;
    }

    private String formatLabel(String enumName) {
        String[] words = enumName.split("_");
        StringBuilder sb = new StringBuilder();
        for (String w : words) {
            if (!w.isEmpty()) {
                sb.append(Character.toUpperCase(w.charAt(0)))
                  .append(w.substring(1).toLowerCase())
                  .append(" ");
            }
        }
        return sb.toString().trim();
    }
}
