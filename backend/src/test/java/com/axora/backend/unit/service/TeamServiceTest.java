package com.axora.backend.unit.service;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.axora.backend.dto.team.TeamRequest;
import com.axora.backend.dto.team.TeamResponse;
import com.axora.backend.entity.Team;
import com.axora.backend.entity.User;
import com.axora.backend.repository.TeamRepository;
import com.axora.backend.repository.UserRepository;
import com.axora.backend.service.TeamService;
import com.axora.backend.service.UserService;

@ExtendWith(MockitoExtension.class)
class TeamServiceTest {

    @Mock
    private TeamRepository teamRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private TeamService teamService;

    @Test
    void createTeam_ShouldCreateAndReturnTeam() {
        // Given
        Set<Long> memberIds = Set.of(1L, 2L);
        Set<User> members = Set.of(
            User.builder().id(1L).name("Member 1").email("member1@test.com").build(),
            User.builder().id(2L).name("Member 2").email("member2@test.com").build()
        );

        TeamRequest request = new TeamRequest();
        request.setName("Test Team");
        request.setDescription("Test Description");
        request.setMemberIds(memberIds);

        Team savedTeam = Team.builder()
            .id(1L)
            .name(request.getName())
            .description(request.getDescription())
            .active(true)
            .members(members)
            .build();

        when(userRepository.findById(1L)).thenReturn(java.util.Optional.of(members.iterator().next()));
        when(userRepository.findById(2L)).thenReturn(java.util.Optional.of(members.iterator().next()));
        when(teamRepository.save(any(Team.class))).thenReturn(savedTeam);

        // When
        TeamResponse response = teamService.createTeam(request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getName()).isEqualTo("Test Team");
        assertThat(response.isActive()).isTrue();
        assertThat(response.getMembers()).hasSize(2);
        verify(teamRepository).save(any(Team.class));
    }

    @Test
    void getAllTeams_ShouldReturnAllTeams() {
        // Given
        Set<User> members = Set.of(
            User.builder().id(1L).name("Member 1").email("member1@test.com").build()
        );

        Team team = Team.builder()
            .id(1L)
            .name("Test Team")
            .description("Test Description")
            .active(true)
            .members(members)
            .build();

        when(teamRepository.findAll()).thenReturn(List.of(team));

        // When
        List<TeamResponse> teams = teamService.getAllTeams();

        // Then
        assertThat(teams).isNotEmpty();
        assertThat(teams.get(0).getName()).isEqualTo("Test Team");
        assertThat(teams.get(0).getMembers()).hasSize(1);
    }

    @Test
    void getTeamById_ShouldReturnTeam() {
        // Given
        Set<User> members = Set.of(
            User.builder().id(1L).name("Member 1").build(),
            User.builder().id(2L).name("Member 2").build()
        );

        Team team = Team.builder()
            .id(1L)
            .name("Test Team")
            .description("Test Description")
            .active(true)
            .members(members)
            .build();

        when(teamRepository.findById(1L)).thenReturn(java.util.Optional.of(team));

        // When
        TeamResponse response = teamService.getTeamById(1L);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getName()).isEqualTo("Test Team");
        assertThat(response.getMembers()).hasSize(2);
    }

    @Test
    void updateTeam_ShouldUpdateAndReturnTeam() {
        // Given
        Team existingTeam = Team.builder()
            .id(1L)
            .name("Old Name")
            .description("Old Description")
            .active(true)
            .build();

        Set<Long> memberIds = Set.of(1L, 2L);
        Set<User> members = Set.of(
            User.builder().id(1L).name("Member 1").build(),
            User.builder().id(2L).name("Member 2").build()
        );

        TeamRequest request = new TeamRequest();
        request.setName("Updated Name");
        request.setDescription("Updated Description");
        request.setMemberIds(memberIds);

        when(teamRepository.findById(1L)).thenReturn(java.util.Optional.of(existingTeam));
        when(userRepository.findById(1L)).thenReturn(java.util.Optional.of(members.iterator().next()));
        when(userRepository.findById(2L)).thenReturn(java.util.Optional.of(members.iterator().next()));
        when(teamRepository.save(any(Team.class))).thenReturn(existingTeam);

        // When
        TeamResponse response = teamService.updateTeam(1L, request);

        // Then
        assertThat(response).isNotNull();
        verify(teamRepository).save(any(Team.class));
    }

    @Test
    void deleteTeam_ShouldDeleteTeam() {
        // Given
        when(teamRepository.existsById(1L)).thenReturn(true);

        // When
        teamService.deleteTeam(1L);

        // Then
        verify(teamRepository).deleteById(1L);
    }
} 