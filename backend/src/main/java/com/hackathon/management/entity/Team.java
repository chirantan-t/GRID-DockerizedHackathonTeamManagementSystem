package com.hackathon.management.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "teams")
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Team name is required")
    @Column(name = "team_name", nullable = false, length = 100)
    private String teamName;

    @NotBlank(message = "Unique team code is required")
    @Column(name = "team_code", nullable = false, unique = true, length = 30)
    private String teamCode;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = true)
    private User createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<TeamMember> members = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<HackathonRegistration> registrations = new ArrayList<>();

    // Transient fields for backward compatibility with legacy services until full API refactor
    @Transient
    private String projectTitle;

    @Transient
    private String projectDescription;

    @Transient
    private String teamLead;

    @Transient
    private Track track;

    @Transient
    private RegistrationStatus registrationStatus = RegistrationStatus.PENDING;

    @Transient
    private ProgressStatus progressStatus;

    public Team() {
    }

    public Team(String teamName, String teamCode, String description, User createdBy) {
        this.teamName = teamName;
        this.teamCode = teamCode;
        this.description = description;
        this.createdBy = createdBy;
    }

    public Team(String teamName, String teamCode, String projectTitle, String projectDescription, String teamLead, Track track) {
        this.teamName = teamName;
        this.teamCode = teamCode;
        this.projectTitle = projectTitle;
        this.projectDescription = projectDescription;
        this.description = projectDescription;
        this.teamLead = teamLead;
        this.track = track;
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void addMember(TeamMember member) {
        members.add(member);
        member.setTeam(this);
    }

    public void removeMember(TeamMember member) {
        members.remove(member);
        member.setTeam(null);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
        if (id != null) {
            if (registrationStatus != null) {
                transientStatusMap.put(id, registrationStatus);
            }
            if (teamLead != null) {
                transientLeadMap.put(id, teamLead);
            }
        }
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public String getTeamCode() {
        return teamCode;
    }

    public void setTeamCode(String teamCode) {
        this.teamCode = teamCode;
    }

    public String getDescription() {
        return description != null ? description : projectDescription;
    }

    public void setDescription(String description) {
        this.description = description;
        this.projectDescription = description;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
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

    public List<TeamMember> getMembers() {
        return members;
    }

    public void setMembers(List<TeamMember> members) {
        this.members = members;
    }

    public List<HackathonRegistration> getRegistrations() {
        return registrations;
    }

    public void setRegistrations(List<HackathonRegistration> registrations) {
        this.registrations = registrations;
    }

    public int getMemberCount() {
        return members != null ? members.size() : 0;
    }

    // Compatibility getters & setters
    public String getProjectTitle() {
        return projectTitle != null ? projectTitle : teamName;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }

    public String getProjectDescription() {
        return projectDescription != null ? projectDescription : description;
    }

    public void setProjectDescription(String projectDescription) {
        this.projectDescription = projectDescription;
        this.description = projectDescription;
    }

    private static final java.util.Map<Long, RegistrationStatus> transientStatusMap = new java.util.concurrent.ConcurrentHashMap<>();
    private static final java.util.Map<Long, String> transientLeadMap = new java.util.concurrent.ConcurrentHashMap<>();

    public String getTeamLead() {
        if (id != null && transientLeadMap.containsKey(id)) {
            return transientLeadMap.get(id);
        }
        if (teamLead != null) return teamLead;
        if (createdBy != null) return createdBy.getEmail();
        return "";
    }

    public void setTeamLead(String teamLead) {
        this.teamLead = teamLead;
        if (id != null && teamLead != null) {
            transientLeadMap.put(id, teamLead);
        }
    }

    public Track getTrack() {
        return track;
    }

    public void setTrack(Track track) {
        this.track = track;
    }

    public RegistrationStatus getRegistrationStatus() {
        if (id != null && transientStatusMap.containsKey(id)) {
            return transientStatusMap.get(id);
        }
        return registrationStatus != null ? registrationStatus : RegistrationStatus.PENDING;
    }

    public void setRegistrationStatus(RegistrationStatus registrationStatus) {
        this.registrationStatus = registrationStatus;
        if (id != null && registrationStatus != null) {
            transientStatusMap.put(id, registrationStatus);
        }
    }

    @PostPersist
    protected void syncTransient() {
        if (id != null) {
            if (registrationStatus != null) {
                transientStatusMap.putIfAbsent(id, registrationStatus);
            }
            if (teamLead != null) {
                transientLeadMap.putIfAbsent(id, teamLead);
            }
        }
    }

    public ProgressStatus getProgressStatus() {
        return progressStatus;
    }

    public void setProgressStatus(ProgressStatus progressStatus) {
        this.progressStatus = progressStatus;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Team other)) return false;
        return id != null && id.equals(other.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
