package com.axora.backend.integration.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.doNothing;
import static org.mockito.ArgumentMatchers.eq;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import com.axora.backend.dto.team.TeamRequest;
import com.axora.backend.dto.team.TeamResponse;
import com.axora.backend.dto.user.UserResponse;
import com.axora.backend.service.TeamService;
import com.axora.backend.controller.TeamController;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.axora.backend.security.JwtAuthenticationFilter;
import com.axora.backend.security.JwtService;
import org.springframework.security.authentication.AuthenticationProvider;

@WebMvcTest(TeamController.class)
@AutoConfigureMockMvc(addFilters = false)
class TeamControllerTest {

    @MockBean
    private TeamService teamService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthFilter;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private AuthenticationProvider authenticationProvider;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createTeam_ShouldReturnCreatedTeam() throws Exception {
        // Given
        TeamRequest request = createTeamRequest();
        TeamResponse response = createTeamResponse(1L);
        when(teamService.createTeam(any(TeamRequest.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/teams")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.name").value("Test Team"));
    }

    @Test
    void getAllTeams_ShouldReturnTeamList() throws Exception {
        // Given
        List<TeamResponse> teams = Arrays.asList(
            createTeamResponse(1L),
            createTeamResponse(2L)
        );
        when(teamService.getAllTeams()).thenReturn(teams);

        // When & Then
        mockMvc.perform(get("/api/teams")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(2)))
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[1].id").value(2));
    }

    @Test
    void getTeamById_ShouldReturnTeam() throws Exception {
        // Given
        TeamResponse response = createTeamResponse(1L);
        when(teamService.getTeamById(1L)).thenReturn(response);

        // When & Then
        mockMvc.perform(get("/api/teams/1")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.name").value("Test Team"));
    }

    @Test
    void updateTeam_ShouldReturnUpdatedTeam() throws Exception {
        // Given
        TeamRequest request = createTeamRequest();
        TeamResponse response = createTeamResponse(1L);
        when(teamService.updateTeam(eq(1L), any(TeamRequest.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(put("/api/teams/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.name").value("Test Team"));
    }

    @Test
    void deleteTeam_ShouldReturnOk() throws Exception {
        // Given
        doNothing().when(teamService).deleteTeam(1L);

        // When & Then
        mockMvc.perform(delete("/api/teams/1")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
    }

    @Test
    void getTeamById_ShouldReturnError_WhenTeamNotFound() throws Exception {
        // Given
        when(teamService.getTeamById(99L))
            .thenThrow(new RuntimeException("Takım bulunamadı"));

        // When & Then
        mockMvc.perform(get("/api/teams/99")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Takım bulunamadı"));
    }

    private TeamRequest createTeamRequest() {
        TeamRequest request = new TeamRequest();
        request.setName("Test Team");
        request.setDescription("Test Description");
        request.setMemberIds(Set.of(1L, 2L));
        return request;
    }

    private TeamResponse createTeamResponse(Long id) {
        Set<UserResponse> members = new HashSet<>();
        members.add(UserResponse.builder()
            .id(1L)
            .name("User 1")
            .email("user1@example.com")
            .build());

        return TeamResponse.builder()
            .id(id)
            .name("Test Team")
            .description("Test Description")
            .active(true)
            .members(members)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();
    }
}