package com.axora.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.axora.backend.entity.Role;
import com.axora.backend.entity.Team;
import com.axora.backend.entity.User;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
class TeamRepositoryTest {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldLoadContext() {
        assertThat(teamRepository).isNotNull();
    }

    @Test
    void findByName_ShouldReturnTeam() {
        // Given
        Team team = Team.builder()
            .name("Test Team")
            .description("Test Description")
            .active(true)
            .build();
        teamRepository.save(team);

        // When
        Optional<Team> found = teamRepository.findByName("Test Team");

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Test Team");
    }

    @Test
    void findByMember_ShouldReturnTeamsForUser() {
        // Given
        User user = User.builder()
            .name("Test User")
            .email("test@example.com")
            .password("password")
            .role(Role.ROLE_USER)
            .active(true)
            .build();
        userRepository.save(user);

        Team team = Team.builder()
            .name("Test Team")
            .description("Test Description")
            .active(true)
            .members(Set.of(user))
            .build();
        teamRepository.save(team);

        // When
        List<Team> teams = teamRepository.findByMember(user);

        // Then
        assertThat(teams).isNotEmpty();
        assertThat(teams.get(0).getMembers()).contains(user);
    }

    @Test
    void findByActiveTrue_ShouldReturnActiveTeams() {
        // Given
        Team activeTeam = Team.builder()
            .name("Active Team")
            .description("Active Description")
            .active(true)
            .build();
        Team inactiveTeam = Team.builder()
            .name("Inactive Team")
            .description("Inactive Description")
            .active(false)
            .build();
        teamRepository.saveAll(List.of(activeTeam, inactiveTeam));

        // When
        List<Team> activeTeams = teamRepository.findByActiveTrue();

        // Then
        assertThat(activeTeams).isNotEmpty();
        assertThat(activeTeams).allMatch(Team::isActive);
    }
} 