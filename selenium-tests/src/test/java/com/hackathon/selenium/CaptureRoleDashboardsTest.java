package com.hackathon.selenium;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class CaptureRoleDashboardsTest extends BaseSeleniumTest {

    private void saveScreenshot(String filename) {
        try {
            File scrFile = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
            Path destPath = Paths.get("target", "screenshots", filename);
            Files.createDirectories(destPath.getParent());
            Files.copy(scrFile.toPath(), destPath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            System.out.println(">>> Saved: " + destPath.toAbsolutePath());
        } catch (Exception e) {
            System.err.println("Failed: " + e.getMessage());
        }
    }

    @Test
    @DisplayName("Capture Role Dashboards")
    public void captureAllRoleDashboards() throws InterruptedException {
        // 1. Team Lead Dashboard
        loginWithRole("TEAM");
        wait.until(ExpectedConditions.urlContains("/team/dashboard"));
        Thread.sleep(800);
        saveScreenshot("demo_role_team_dashboard.png");

        // 2. Organizer Dashboard
        loginWithRole("ORGANIZER");
        wait.until(ExpectedConditions.urlContains("/organizer/dashboard"));
        Thread.sleep(800);
        saveScreenshot("demo_role_organizer_dashboard.png");

        // 3. Super Admin Dashboard
        loginWithRole("SUPER_ADMIN");
        wait.until(ExpectedConditions.urlContains("/admin/dashboard"));
        Thread.sleep(800);
        saveScreenshot("demo_role_admin_dashboard.png");
    }
}
