package com.hackathon.management.dto;

import com.hackathon.management.entity.AnnouncementPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class AnnouncementCreateRequest {

    @NotNull(message = "Hackathon ID is required")
    private Long hackathonId;

    @NotBlank(message = "Title is required")
    @Size(min = 2, max = 150, message = "Title must be between 2 and 150 characters")
    private String title;

    @NotBlank(message = "Message is required")
    private String message;

    private AnnouncementPriority priority = AnnouncementPriority.NORMAL;

    public AnnouncementCreateRequest() {
    }

    public AnnouncementCreateRequest(Long hackathonId, String title, String message, AnnouncementPriority priority) {
        this.hackathonId = hackathonId;
        this.title = title;
        this.message = message;
        this.priority = priority;
    }

    public Long getHackathonId() {
        return hackathonId;
    }

    public void setHackathonId(Long hackathonId) {
        this.hackathonId = hackathonId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getContent() {
        return message;
    }

    public void setContent(String content) {
        this.message = content;
    }

    public AnnouncementPriority getPriority() {
        return priority;
    }

    public void setPriority(AnnouncementPriority priority) {
        this.priority = priority;
    }
}

