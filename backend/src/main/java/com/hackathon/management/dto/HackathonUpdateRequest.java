package com.hackathon.management.dto;

import com.hackathon.management.entity.HackathonMode;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public class HackathonUpdateRequest {

    @Size(min = 3, max = 150, message = "Title must be between 3 and 150 characters")
    private String title;

    private String description;

    @Size(max = 50, message = "Category cannot exceed 50 characters")
    private String category;

    @Size(max = 255, message = "Banner image URL cannot exceed 255 characters")
    private String bannerImage;

    @Size(max = 150, message = "Venue cannot exceed 150 characters")
    private String venue;

    private HackathonMode mode;

    private LocalDateTime registrationStart;

    private LocalDateTime registrationDeadline;

    private LocalDateTime eventStart;

    private LocalDateTime eventEnd;

    @Min(value = 1, message = "Min team size must be at least 1")
    private Integer minTeamSize;

    @Max(value = 10, message = "Max team size cannot exceed 10")
    private Integer maxTeamSize;

    @Size(max = 50, message = "Prize pool cannot exceed 50 characters")
    private String prizePool;

    private String rules;

    public HackathonUpdateRequest() {
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
}

