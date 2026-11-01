package com.hackathon.selenium;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(OrderAnnotation.class)
public class UserJourneysTest extends BaseSeleniumTest {

    @Test
    @Order(1)
    @DisplayName("Journey 1: Authentication, credential validation, and role redirection")
    public void testJourney1_LoginValidation() {
        driver.get(baseUrl + "/login");

        // Step 1: Open email sign-in mode
        WebElement emailOptionBtn = waitForClickable(By.id("btn-use-email"));
        jsClick(emailOptionBtn);

        // Step 2: Submit invalid credentials
        WebElement userInput = waitForVisibility(By.id("username"));
        setInputValue(userInput, "invalid_user@grid.io");

        WebElement passInput = waitForVisibility(By.id("password"));
        setInputValue(passInput, "wrong_password");

        jsClick(waitForClickable(By.id("login-button")));

        // Step 3: Verify error alert displayed
        WebElement errorAlert = waitForVisibility(By.id("login-error"));
        assertTrue(errorAlert.isDisplayed(), "Login error alert should be visible on invalid credentials");

        // Step 4: Login via Team Lead role button
        loginWithRole("TEAM");

        // Step 5: Verify redirect to team dashboard
        wait.until(ExpectedConditions.urlContains("/team/dashboard"));
        assertTrue(driver.getCurrentUrl().contains("/team/dashboard"), "Should redirect to Team Dashboard");
    }

    @Test
    @Order(2)
    @DisplayName("Journey 2: Team Lead - Discover hackathons and view details")
    public void testJourney2_ExploreHackathonsWorkflow() {
        loginWithRole("TEAM");

        // Navigate to explore hackathons
        driver.get(baseUrl + "/team/explore");
        wait.until(ExpectedConditions.urlContains("/team/explore"));

        // Verify page content renders hackathon options
        WebElement pageBody = waitForVisibility(By.tagName("main"));
        assertNotNull(pageBody, "Main content area should be present");
        assertTrue(pageBody.getText().contains("Hackathon") || pageBody.getText().contains("Explore"),
                "Explore page should contain Hackathon cards or listings");
    }

    @Test
    @Order(3)
    @DisplayName("Journey 3: Team Lead - Workspace inspection and announcements stream")
    public void testJourney3_TeamWorkspaceAndAnnouncements() {
        loginWithRole("TEAM");

        // Navigate to workspace
        driver.get(baseUrl + "/team/workspace");
        wait.until(ExpectedConditions.urlContains("/team/workspace"));

        WebElement workspaceMain = waitForVisibility(By.tagName("main"));
        assertNotNull(workspaceMain, "Team workspace should render successfully");

        // Navigate to announcements
        driver.get(baseUrl + "/team/announcements");
        wait.until(ExpectedConditions.urlContains("/team/announcements"));

        WebElement announcementsMain = waitForVisibility(By.tagName("main"));
        assertNotNull(announcementsMain, "Announcements view should render successfully");
    }

    @Test
    @Order(4)
    @DisplayName("Journey 4: Organizer - Dashboard metrics, hackathon oversight, and team tracking")
    public void testJourney4_OrganizerWorkflows() {
        loginWithRole("ORGANIZER");

        // Verify organizer dashboard
        wait.until(ExpectedConditions.urlContains("/organizer/dashboard"));
        assertTrue(driver.getCurrentUrl().contains("/organizer/dashboard"),
                "Should navigate to Organizer Dashboard");

        // Navigate to hackathons view
        driver.get(baseUrl + "/organizer/hackathons");
        wait.until(ExpectedConditions.urlContains("/organizer/hackathons"));
        assertNotNull(waitForVisibility(By.tagName("main")), "Organizer hackathons list should render");

        // Navigate to teams view
        driver.get(baseUrl + "/organizer/teams");
        wait.until(ExpectedConditions.urlContains("/organizer/teams"));
        assertNotNull(waitForVisibility(By.tagName("main")), "Organizer teams list should render");
    }

    @Test
    @Order(5)
    @DisplayName("Journey 5: Super Admin - Executive governance, user administration, and health telemetry")
    public void testJourney5_SuperAdminGovernance() {
        loginWithRole("SUPER_ADMIN");

        // Verify super admin dashboard
        wait.until(ExpectedConditions.urlContains("/admin/dashboard"));
        assertTrue(driver.getCurrentUrl().contains("/admin/dashboard"),
                "Should navigate to Super Admin Dashboard");

        // Navigate to user management
        driver.get(baseUrl + "/admin/users");
        wait.until(ExpectedConditions.urlContains("/admin/users"));
        assertNotNull(waitForVisibility(By.tagName("main")), "Super admin user table should render");

        // Navigate to system health telemetry
        driver.get(baseUrl + "/admin/health");
        wait.until(ExpectedConditions.urlContains("/admin/health"));
        assertNotNull(waitForVisibility(By.tagName("main")), "Super admin system health should render");
    }
}
