package com.example.demo.controller;

import com.example.demo.exception.InvalidCredentialsException;
import com.example.demo.model.User;
import com.example.demo.security.JwtService;
import com.example.demo.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired private MockMvc mockMvc;

    @MockitoBean private UserService userService;
    @MockitoBean private JwtService jwtService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // ── Register ──────────────────────────────────────────────────────────

    @Test
    void register_shouldReturn200_whenPayloadIsValid() throws Exception {
        User user = new User();
        user.setId(1);
        user.setEmail("alice@example.com");
        user.setUsername("alice");

        when(userService.register(any())).thenReturn(user);
        when(jwtService.generateToken(anyString())).thenReturn("fake-token");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "username", "alice",
                        "email", "alice@example.com",
                        "password", "strongpass123"
                ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("fake-token"));
    }

    @Test
    void register_shouldReturn400_whenEmailIsInvalid() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "username", "alice",
                        "email", "not-an-email",
                        "password", "strongpass123"
                ))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(containsString("email")));
    }

    @Test
    void register_shouldReturn400_whenPasswordTooShort() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "username", "alice",
                        "email", "alice@example.com",
                        "password", "short"
                ))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(containsString("password")));
    }

    // ── Login ─────────────────────────────────────────────────────────────

    @Test
    void login_shouldReturn200_whenCredentialsAreValid() throws Exception {
        User user = new User();
        user.setEmail("alice@example.com");

        when(userService.authenticate(anyString(), anyString())).thenReturn(user);
        when(jwtService.generateToken(anyString(), anyBoolean())).thenReturn("fake-token");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "email", "alice@example.com",
                        "password", "strongpass123",
                        "rememberMe", false
                ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("fake-token"));
    }

    @Test
    void login_shouldReturn401_whenPasswordIsWrong() throws Exception {
        when(userService.authenticate(anyString(), anyString()))
                .thenThrow(new InvalidCredentialsException());

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "email", "alice@example.com",
                        "password", "wrongpassword",
                        "rememberMe", false
                ))))
                .andExpect(status().isUnauthorized());
    }
}