package com.hackathon.management.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "team_members", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"team_id", "user_id"}, name = "uk_team_member")
})
public class TeamMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "team_id", nullable = false)
    @JsonIgnore
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @NotBlank(message = "Member role is required")
    @Column(name = "member_role", nullable = false, length = 50)
    private String memberRole = "DEVELOPER";

    @Column(name = "joined_at", nullable = false, updatable = false)
    private LocalDateTime joinedAt;

    // Transient fields for backward compatibility with legacy services
    @Transient
    private String fullName;

    @Transient
    private String email;

    @Transient
    private String college;

    @Transient
    private String department;

    @Transient
    private TeamRole teamRole;

    public TeamMember() {
    }

    public TeamMember(Team team, User user, String memberRole) {
        this.team = team;
        this.user = user;
        this.memberRole = memberRole;
    }

    public TeamMember(String fullName, String email, String college, String department, TeamRole teamRole) {
        this.fullName = fullName;
        this.email = email;
        this.college = college;
        this.department = department;
        this.teamRole = teamRole;
        this.memberRole = teamRole != null ? teamRole.name() : "DEVELOPER";
    }

    @PrePersist
    protected void onCreate() {
        if (this.joinedAt == null) {
            this.joinedAt = LocalDateTime.now();
        }
        if (this.memberRole == null) {
            this.memberRole = teamRole != null ? teamRole.name() : "DEVELOPER";
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getMemberRole() {
        return memberRole;
    }

    public void setMemberRole(String memberRole) {
        this.memberRole = memberRole;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }

    // Compatibility getters & setters
    public String getFullName() {
        if (fullName != null) return fullName;
        if (user != null) return user.getFullName();
        return "";
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        if (email != null) return email;
        if (user != null) return user.getEmail();
        return "";
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCollege() {
        return college;
    }

    public void setCollege(String college) {
        this.college = college;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public TeamRole getTeamRole() {
        if (teamRole != null) return teamRole;
        try {
            return TeamRole.valueOf(memberRole);
        } catch (Exception e) {
            return TeamRole.FULLSTACK;
        }
    }

    public void setTeamRole(TeamRole teamRole) {
        this.teamRole = teamRole;
        if (teamRole != null) {
            this.memberRole = teamRole.name();
        }
    }

    public LocalDateTime getCreatedAt() {
        return joinedAt != null ? joinedAt : LocalDateTime.now();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TeamMember that)) return false;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
