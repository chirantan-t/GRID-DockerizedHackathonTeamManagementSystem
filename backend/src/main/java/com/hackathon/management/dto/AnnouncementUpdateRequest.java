package com.hackathon.management.dto;

import com.hackathon.management.entity.AnnouncementPriority;
import jakarta.validation.constraints.Size;

public class AnnouncementUpdateRequest {

    @Size(min = 2, max = 150, message = "Title must be between 2 and 150 characters")
    private String title;

    private String message;

    private AnnouncementPriority priority;

    public AnnouncementUpdateRequest() {
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

    public AnnouncementPriority getPriority() {
        return priority;
    }

    public void setPriority(AnnouncementPriority priority) {
        this.priority = priority;
    }
}

