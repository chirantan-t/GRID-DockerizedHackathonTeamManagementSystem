package com.hackathon.selenium;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class CaptureDemoScreenshotsTest extends BaseSeleniumTest {

    private void saveScreenshot(String filename) {
        try {
            File scrFile = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
            Path destPath = Paths.get("target", "screenshots", filename);
            Files.createDirectories(destPath.getParent());
            Files.copy(scrFile.toPath(), destPath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            System.out.println(">>> Successfully saved live demo screenshot to: " + destPath.toAbsolutePath());
        } catch (Exception e) {
            System.err.println("Failed to capture demo screenshot: " + e.getMessage());
        }
    }

    @Test
    @DisplayName("Capture Live Demo Screenshots")
    public void captureAllDemoScreenshots() throws InterruptedException {
        // 1. Landing Page
        driver.get(baseUrl + "/");
        Thread.sleep(800);
        saveScreenshot("demo01_landing_page.png");

        // 2. Login Page
        driver.get(baseUrl + "/login");
        Thread.sleep(800);
        saveScreenshot("demo02_login_page.png");

        // 3. Team Lead Dashboard
        loginWithRole("TEAM");
        wait.until(ExpectedConditions.urlContains("/team/dashboard"));
        Thread.sleep(800);
        saveScreenshot("demo03_team_dashboard.png");

        // 4. Explore Hackathons
        driver.get(baseUrl + "/team/explore");
        wait.until(ExpectedConditions.urlContains("/team/explore"));
        Thread.sleep(800);
        saveScreenshot("demo04_explore_hackathons.png");

        // 5. Team Workspace
        driver.get(baseUrl + "/team/workspace");
        wait.until(ExpectedConditions.urlContains("/team/workspace"));
        Thread.sleep(800);
        saveScreenshot("demo05_team_workspace.png");

        // 6. Organizer Dashboard
        loginWithRole("ORGANIZER");
        wait.until(ExpectedConditions.urlContains("/organizer/dashboard"));
        Thread.sleep(800);
        saveScreenshot("demo06_organizer_dashboard.png");

        // 7. Super Admin Dashboard
        loginWithRole("SUPER_ADMIN");
        wait.until(ExpectedConditions.urlContains("/admin/dashboard"));
        Thread.sleep(800);
        saveScreenshot("demo07_superadmin_dashboard.png");
    }
}
