package com.hackathon.management.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hackathon.management.dto.LoginRequest;
import com.hackathon.management.entity.Role;
import com.hackathon.management.entity.RoleName;
import com.hackathon.management.entity.User;
import com.hackathon.management.repository.RoleRepository;
import com.hackathon.management.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setupUser() {
        Role adminRole = roleRepository.findByRoleName(RoleName.SUPER_ADMIN)
                .orElseGet(() -> roleRepository.save(new Role(RoleName.SUPER_ADMIN, "Super Administrator")));

        User user = userRepository.findByEmail("admin_test@grid.dev").orElse(null);
        if (user == null) {
            user = new User("admin_test@grid.dev", passwordEncoder.encode("TestPass@123"), "Admin Tester", adminRole);
            userRepository.save(user);
        }
    }

    @Test
    @DisplayName("POST /api/auth/login should return 200 OK and user details on valid credentials")
    void testLogin_Success() throws Exception {
        LoginRequest loginRequest = new LoginRequest("admin_test@grid.dev", "TestPass@123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("admin_test@grid.dev"));
    }

    @Test
    @DisplayName("POST /api/auth/login with invalid password returns 401 Unauthorized")
    void testLogin_InvalidCredentials() throws Exception {
        LoginRequest loginRequest = new LoginRequest("admin_test@grid.dev", "WrongPassword");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/auth/me without session returns 401 Unauthorized")
    void testGetMe_Unauthenticated() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }
}
