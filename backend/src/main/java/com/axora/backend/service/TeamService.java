package com.axora.backend.service;

import com.axora.backend.dto.team.TeamRequest;
import com.axora.backend.dto.team.TeamResponse;
import com.axora.backend.dto.user.UserSummary;
import com.axora.backend.entity.Team;
import com.axora.backend.entity.User;
import com.axora.backend.repository.TeamRepository;
import com.axora.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final UserRepository userRepository;

    @Transactional
    public TeamResponse createTeam(TeamRequest request) {
        if (teamRepository.existsByName(request.getName())) {
            throw new RuntimeException("Bu isimde bir takım zaten mevcut");
        }

        Set<User> members = new HashSet<>();
        if (request.getMemberIds() != null && !request.getMemberIds().isEmpty()) {
            members = request.getMemberIds().stream()
                    .map(id -> userRepository.findById(id)
                            .orElseThrow(() -> new EntityNotFoundException("Kullanıcı bulunamadı: " + id)))
                    .collect(Collectors.toSet());
        }

        Team team = Team.builder()
                .name(request.getName())
                .description(request.getDescription())
                .members(members)
                .build();

        team = teamRepository.save(team);
        return mapToResponse(team);
    }

    @Transactional(readOnly = true)
    public List<TeamResponse> getAllTeams() {
        return teamRepository.findByActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TeamResponse getTeamById(Long id) {
        return teamRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new EntityNotFoundException("Takım bulunamadı"));
    }

    @Transactional
    public TeamResponse updateTeam(Long id, TeamRequest request) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Takım bulunamadı"));

        if (!team.getName().equals(request.getName()) && 
            teamRepository.existsByName(request.getName())) {
            throw new RuntimeException("Bu isimde bir takım zaten mevcut");
        }

        Set<User> members = new HashSet<>();
        if (request.getMemberIds() != null && !request.getMemberIds().isEmpty()) {
            members = request.getMemberIds().stream()
                    .map(userId -> userRepository.findById(userId)
                            .orElseThrow(() -> new EntityNotFoundException("Kullanıcı bulunamadı: " + userId)))
                    .collect(Collectors.toSet());
        }

        team.setName(request.getName());
        team.setDescription(request.getDescription());
        team.setMembers(members);

        team = teamRepository.save(team);
        return mapToResponse(team);
    }

    @Transactional
    public void deleteTeam(Long id) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Takım bulunamadı"));
        
        team.setActive(false);
        teamRepository.save(team);
    }

    private TeamResponse mapToResponse(Team team) {
        Set<UserSummary> memberSummaries = team.getMembers().stream()
                .map(this::mapToUserSummary)
                .collect(Collectors.toSet());

        return TeamResponse.builder()
                .id(team.getId())
                .name(team.getName())
                .description(team.getDescription())
                .members(memberSummaries)
                .active(team.isActive())
                .createdAt(team.getCreatedAt())
                .updatedAt(team.getUpdatedAt())
                .build();
    }

    private UserSummary mapToUserSummary(User user) {
        return UserSummary.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .profilePicture(user.getProfilePicture())
                .build();
    }
} 