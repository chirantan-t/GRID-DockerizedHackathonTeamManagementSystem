package com.hackathon.management.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "hackathons")
public class Hackathon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "organizer_id", nullable = false)
    private User organizer;

    @NotBlank
    @Column(nullable = false, length = 150)
    private String title;

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @NotBlank
    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "banner_image", length = 255)
    private String bannerImage;

    @Column(length = 150)
    private String venue;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private HackathonMode mode = HackathonMode.OFFLINE;

    @NotNull
    @Column(name = "registration_start", nullable = false)
    private LocalDateTime registrationStart;

    @NotNull
    @Column(name = "registration_deadline", nullable = false)
    private LocalDateTime registrationDeadline;

    @NotNull
    @Column(name = "event_start", nullable = false)
    private LocalDateTime eventStart;

    @NotNull
    @Column(name = "event_end", nullable = false)
    private LocalDateTime eventEnd;

    @Column(name = "min_team_size", nullable = false)
    private Integer minTeamSize = 1;

    @Column(name = "max_team_size", nullable = false)
    private Integer maxTeamSize = 4;

    @Column(name = "prize_pool", length = 50)
    private String prizePool;

    @Column(columnDefinition = "TEXT")
    private String rules;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private HackathonStatus status = HackathonStatus.DRAFT;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @JsonIgnore
    @OneToMany(mappedBy = "hackathon", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<HackathonRegistration> registrations = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "hackathon", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Announcement> announcements = new ArrayList<>();

    public Hackathon() {
    }

    public Hackathon(User organizer, String title, String description, String category, HackathonMode mode,
                     LocalDateTime registrationStart, LocalDateTime registrationDeadline,
                     LocalDateTime eventStart, LocalDateTime eventEnd) {
        this.organizer = organizer;
        this.title = title;
        this.description = description;
        this.category = category;
        this.mode = mode;
        this.registrationStart = registrationStart;
        this.registrationDeadline = registrationDeadline;
        this.eventStart = eventStart;
        this.eventEnd = eventEnd;
        this.status = HackathonStatus.DRAFT;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = HackathonStatus.DRAFT;
        }
        if (this.minTeamSize == null) {
            this.minTeamSize = 1;
        }
        if (this.maxTeamSize == null) {
            this.maxTeamSize = 4;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getOrganizer() {
        return organizer;
    }

    public void setOrganizer(User organizer) {
        this.organizer = organizer;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getBannerImage() {
        return bannerImage;
    }

    public void setBannerImage(String bannerImage) {
        this.bannerImage = bannerImage;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public HackathonMode getMode() {
        return mode;
    }

    public void setMode(HackathonMode mode) {
        this.mode = mode;
    }

    public LocalDateTime getRegistrationStart() {
        return registrationStart;
    }

    public void setRegistrationStart(LocalDateTime registrationStart) {
        this.registrationStart = registrationStart;
    }

    public LocalDateTime getRegistrationDeadline() {
        return registrationDeadline;
    }

    public void setRegistrationDeadline(LocalDateTime registrationDeadline) {
        this.registrationDeadline = registrationDeadline;
    }

    public LocalDateTime getEventStart() {
        return eventStart;
    }

    public void setEventStart(LocalDateTime eventStart) {
        this.eventStart = eventStart;
    }

    public LocalDateTime getEventEnd() {
        return eventEnd;
    }

    public void setEventEnd(LocalDateTime eventEnd) {
        this.eventEnd = eventEnd;
    }

    public Integer getMinTeamSize() {
        return minTeamSize;
    }

    public void setMinTeamSize(Integer minTeamSize) {
        this.minTeamSize = minTeamSize;
    }

    public Integer getMaxTeamSize() {
        return maxTeamSize;
    }

    public void setMaxTeamSize(Integer maxTeamSize) {
        this.maxTeamSize = maxTeamSize;
    }

    public String getPrizePool() {
        return prizePool;
    }

    public void setPrizePool(String prizePool) {
        this.prizePool = prizePool;
    }

    public String getRules() {
        return rules;
    }

    public void setRules(String rules) {
        this.rules = rules;
    }

    public HackathonStatus getStatus() {
        return status;
    }

    public void setStatus(HackathonStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<HackathonRegistration> getRegistrations() {
        return registrations;
    }

    public void setRegistrations(List<HackathonRegistration> registrations) {
        this.registrations = registrations;
    }

    public List<Announcement> getAnnouncements() {
        return announcements;
    }

    public void setAnnouncements(List<Announcement> announcements) {
        this.announcements = announcements;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Hackathon other)) return false;
        return id != null && id.equals(other.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}

