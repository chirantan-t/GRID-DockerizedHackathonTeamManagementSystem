package com.hackathon.management.service;

import com.hackathon.management.dto.HackathonCreateRequest;
import com.hackathon.management.dto.HackathonResponseDto;
import com.hackathon.management.dto.HackathonUpdateRequest;
import com.hackathon.management.entity.Hackathon;
import com.hackathon.management.entity.HackathonStatus;
import com.hackathon.management.entity.User;
import com.hackathon.management.exception.InvalidWorkflowException;
import com.hackathon.management.exception.ResourceNotFoundException;
import com.hackathon.management.exception.UnauthorizedActionException;
import com.hackathon.management.repository.HackathonRegistrationRepository;
import com.hackathon.management.repository.HackathonRepository;
import com.hackathon.management.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class HackathonService {

    private final HackathonRepository hackathonRepository;
    private final UserRepository userRepository;
    private final HackathonRegistrationRepository registrationRepository;

    public HackathonService(HackathonRepository hackathonRepository,
                            UserRepository userRepository,
                            HackathonRegistrationRepository registrationRepository) {
        this.hackathonRepository = hackathonRepository;
        this.userRepository = userRepository;
        this.registrationRepository = registrationRepository;
    }

    public HackathonResponseDto createHackathon(HackathonCreateRequest request, String organizerEmail) {
        User organizer = userRepository.findByEmail(organizerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Organizer user not found: " + organizerEmail));

        validateDates(request.getRegistrationStart(), request.getRegistrationDeadline(),
                request.getEventStart(), request.getEventEnd());

        if (request.getMinTeamSize() > request.getMaxTeamSize()) {
            throw new InvalidWorkflowException("Min team size cannot exceed max team size");
        }

        Hackathon hackathon = new Hackathon(
                organizer,
                request.getTitle().trim(),
                request.getDescription().trim(),
                request.getCategory().trim(),
                request.getMode(),
                request.getRegistrationStart(),
                request.getRegistrationDeadline(),
                request.getEventStart(),
                request.getEventEnd()
        );

        hackathon.setBannerImage(request.getBannerImage());
        hackathon.setVenue(request.getVenue());
        hackathon.setMinTeamSize(request.getMinTeamSize());
        hackathon.setMaxTeamSize(request.getMaxTeamSize());
        hackathon.setPrizePool(request.getPrizePool());
        hackathon.setRules(request.getRules());
        hackathon.setStatus(HackathonStatus.DRAFT);

        Hackathon saved = hackathonRepository.save(hackathon);
        return mapToDto(saved);
    }

    public HackathonResponseDto updateHackathon(Long id, HackathonUpdateRequest request, String userEmail, boolean isAdmin) {
        Hackathon hackathon = getHackathonEntity(id);
        validateOwnership(hackathon, userEmail, isAdmin);

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            hackathon.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null && !request.getDescription().isBlank()) {
            hackathon.setDescription(request.getDescription().trim());
        }
        if (request.getCategory() != null && !request.getCategory().isBlank()) {
            hackathon.setCategory(request.getCategory().trim());
        }
        if (request.getBannerImage() != null) {
            hackathon.setBannerImage(request.getBannerImage().trim());
        }
        if (request.getVenue() != null) {
            hackathon.setVenue(request.getVenue().trim());
        }
        if (request.getMode() != null) {
            hackathon.setMode(request.getMode());
        }
        if (request.getRegistrationStart() != null) {
            hackathon.setRegistrationStart(request.getRegistrationStart());
        }
        if (request.getRegistrationDeadline() != null) {
            hackathon.setRegistrationDeadline(request.getRegistrationDeadline());
        }
        if (request.getEventStart() != null) {
            hackathon.setEventStart(request.getEventStart());
        }
        if (request.getEventEnd() != null) {
            hackathon.setEventEnd(request.getEventEnd());
        }
        if (request.getMinTeamSize() != null) {
            hackathon.setMinTeamSize(request.getMinTeamSize());
        }
        if (request.getMaxTeamSize() != null) {
            hackathon.setMaxTeamSize(request.getMaxTeamSize());
        }
        if (request.getPrizePool() != null) {
            hackathon.setPrizePool(request.getPrizePool().trim());
        }
        if (request.getRules() != null) {
            hackathon.setRules(request.getRules());
        }

        validateDates(hackathon.getRegistrationStart(), hackathon.getRegistrationDeadline(),
                hackathon.getEventStart(), hackathon.getEventEnd());

        if (hackathon.getMinTeamSize() > hackathon.getMaxTeamSize()) {
            throw new InvalidWorkflowException("Min team size cannot exceed max team size");
        }

        Hackathon updated = hackathonRepository.save(hackathon);
        return mapToDto(updated);
    }

    public HackathonResponseDto publishHackathon(Long id, String userEmail, boolean isAdmin) {
        Hackathon hackathon = getHackathonEntity(id);
        validateOwnership(hackathon, userEmail, isAdmin);

        if (hackathon.getStatus() != HackathonStatus.DRAFT) {
            throw new InvalidWorkflowException("Only DRAFT hackathons can be published. Current status: " + hackathon.getStatus());
        }

        hackathon.setStatus(HackathonStatus.PUBLISHED);
        Hackathon saved = hackathonRepository.save(hackathon);
        return mapToDto(saved);
    }

    public HackathonResponseDto updateStatus(Long id, HackathonStatus targetStatus, String userEmail, boolean isAdmin) {
        Hackathon hackathon = getHackathonEntity(id);
        validateOwnership(hackathon, userEmail, isAdmin);

        HackathonStatus current = hackathon.getStatus();
        if (current == targetStatus) {
            return mapToDto(hackathon);
        }

        boolean validTransition = switch (current) {
            case DRAFT -> targetStatus == HackathonStatus.PUBLISHED || targetStatus == HackathonStatus.CANCELLED;
            case PUBLISHED -> targetStatus == HackathonStatus.ONGOING || targetStatus == HackathonStatus.CANCELLED;
            case ONGOING -> targetStatus == HackathonStatus.COMPLETED || targetStatus == HackathonStatus.CANCELLED;
            case COMPLETED, CANCELLED -> false;
        };

        if (!validTransition && !isAdmin) {
            throw new InvalidWorkflowException("Invalid hackathon status transition from " + current + " to " + targetStatus);
        }

        hackathon.setStatus(targetStatus);
        Hackathon saved = hackathonRepository.save(hackathon);
        return mapToDto(saved);
    }

    public void deleteHackathon(Long id, String userEmail, boolean isAdmin) {
        Hackathon hackathon = getHackathonEntity(id);
        validateOwnership(hackathon, userEmail, isAdmin);

        if (hackathon.getStatus() == HackathonStatus.ONGOING) {
            throw new InvalidWorkflowException("Cannot delete an ongoing hackathon. Cancel or complete it first.");
        }

        hackathonRepository.delete(hackathon);
    }

    @Transactional(readOnly = true)
    public HackathonResponseDto getHackathonById(Long id) {
        Hackathon hackathon = getHackathonEntity(id);
        return mapToDto(hackathon);
    }

    @Transactional(readOnly = true)
    public List<HackathonResponseDto> listPublishedHackathons() {
        return hackathonRepository.findByStatus(HackathonStatus.PUBLISHED).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<HackathonResponseDto> searchAndFilter(HackathonStatus status, String category, String query) {
        String cleanQuery = (query != null && !query.isBlank()) ? query.trim() : null;
        String cleanCategory = (category != null && !category.isBlank()) ? category.trim() : null;
        return hackathonRepository.searchAndFilter(status, cleanCategory, cleanQuery).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<HackathonResponseDto> getOrganizerHackathons(Long organizerId) {
        return hackathonRepository.findByOrganizerId(organizerId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public Hackathon getHackathonEntity(Long id) {
        return hackathonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hackathon not found with ID: " + id));
    }

    private void validateOwnership(Hackathon hackathon, String userEmail, boolean isAdmin) {
        if (isAdmin) {
            return;
        }
        if (hackathon.getOrganizer() == null || !hackathon.getOrganizer().getEmail().equalsIgnoreCase(userEmail)) {
            throw new UnauthorizedActionException("You are not authorized to manage this hackathon.");
        }
    }

    private void validateDates(java.time.LocalDateTime regStart, java.time.LocalDateTime regDeadline,
                               java.time.LocalDateTime evtStart, java.time.LocalDateTime evtEnd) {
        if (regStart != null && regDeadline != null && regDeadline.isBefore(regStart)) {
            throw new InvalidWorkflowException("Registration deadline cannot be before registration start");
        }
        if (regDeadline != null && evtStart != null && evtStart.isBefore(regDeadline)) {
            throw new InvalidWorkflowException("Event start cannot be before registration deadline");
        }
        if (evtStart != null && evtEnd != null && evtEnd.isBefore(evtStart)) {
            throw new InvalidWorkflowException("Event end cannot be before event start");
        }
    }

    public HackathonResponseDto mapToDto(Hackathon hackathon) {
        HackathonResponseDto dto = new HackathonResponseDto();
        dto.setId(hackathon.getId());
        if (hackathon.getOrganizer() != null) {
            dto.setOrganizerId(hackathon.getOrganizer().getId());
            dto.setOrganizerName(hackathon.getOrganizer().getFullName());
            dto.setOrganizerEmail(hackathon.getOrganizer().getEmail());
        }
        dto.setTitle(hackathon.getTitle());
        dto.setDescription(hackathon.getDescription());
        dto.setCategory(hackathon.getCategory());
        dto.setBannerImage(hackathon.getBannerImage());
        dto.setVenue(hackathon.getVenue());
        dto.setMode(hackathon.getMode());
        dto.setRegistrationStart(hackathon.getRegistrationStart());
        dto.setRegistrationDeadline(hackathon.getRegistrationDeadline());
        dto.setEventStart(hackathon.getEventStart());
        dto.setEventEnd(hackathon.getEventEnd());
        dto.setMinTeamSize(hackathon.getMinTeamSize());
        dto.setMaxTeamSize(hackathon.getMaxTeamSize());
        dto.setPrizePool(hackathon.getPrizePool());
        dto.setRules(hackathon.getRules());
        dto.setStatus(hackathon.getStatus());
        dto.setRegistrationsCount(registrationRepository.countByHackathonId(hackathon.getId()));
        dto.setCreatedAt(hackathon.getCreatedAt());
        dto.setUpdatedAt(hackathon.getUpdatedAt());
        return dto;
    }
}

