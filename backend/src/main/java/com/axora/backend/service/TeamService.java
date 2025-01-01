package com.axora.backend.service;

import com.axora.backend.dto.team.TeamRequest;
import com.axora.backend.dto.team.TeamResponse;
import com.axora.backend.dto.user.UserResponse;
import com.axora.backend.entity.Team;
import com.axora.backend.entity.User;
import com.axora.backend.repository.TeamRepository;
import com.axora.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final UserRepository userRepository;

    public TeamResponse createTeam(TeamRequest request) {
        Team team = Team.builder()
                .name(request.getName())
                .description(request.getDescription())
                .active(true)
                .build();

        if (request.getMemberIds() != null && !request.getMemberIds().isEmpty()) {
            Set<User> members = request.getMemberIds().stream()
                    .map(id -> userRepository.findById(id)
                            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı: " + id)))
                    .collect(Collectors.toSet());
            team.setMembers(members);
        }

        Team savedTeam = teamRepository.save(team);
        return mapToResponse(savedTeam);
    }

    public List<TeamResponse> getAllTeams() {
        return teamRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TeamResponse getTeamById(Long id) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Takım bulunamadı"));
        return mapToResponse(team);
    }

    public TeamResponse updateTeam(Long id, TeamRequest request) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Takım bulunamadı"));

        team.setName(request.getName());
        team.setDescription(request.getDescription());

        if (request.getMemberIds() != null) {
            Set<User> members = request.getMemberIds().stream()
                    .map(memberId -> userRepository.findById(memberId)
                            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı: " + memberId)))
                    .collect(Collectors.toSet());
            team.setMembers(members);
        }

        Team updatedTeam = teamRepository.save(team);
        return mapToResponse(updatedTeam);
    }

    public void deleteTeam(Long id) {
        if (!teamRepository.existsById(id)) {
            throw new RuntimeException("Takım bulunamadı");
        }
        teamRepository.deleteById(id);
    }

    private TeamResponse mapToResponse(Team team) {
        return TeamResponse.builder()
                .id(team.getId())
                .name(team.getName())
                .description(team.getDescription())
                .active(team.isActive())
                .members(team.getMembers().stream()
                        .map(this::mapToUserResponse)
                        .collect(Collectors.toSet()))
                .createdAt(team.getCreatedAt())
                .updatedAt(team.getUpdatedAt())
                .build();
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .active(user.isActive())
                .build();
    }
} 