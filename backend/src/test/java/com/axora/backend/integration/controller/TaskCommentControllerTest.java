package com.axora.backend.integration.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.ArgumentMatchers.eq;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.doNothing;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import com.axora.backend.controller.TaskCommentController;
import com.axora.backend.dto.comment.CommentRequest;
import com.axora.backend.dto.comment.CommentResponse;
import com.axora.backend.service.TaskCommentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.axora.backend.security.JwtAuthenticationFilter;
import com.axora.backend.security.JwtService;
import org.springframework.security.authentication.AuthenticationProvider;


@WebMvcTest(TaskCommentController.class)
@AutoConfigureMockMvc(addFilters = false)
class TaskCommentControllerTest {

    @MockBean
    private TaskCommentService commentService;

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
    void addComment_ShouldReturnCreatedComment() throws Exception {
        // Given
        CommentRequest request = createCommentRequest();
        CommentResponse response = createCommentResponse(1L);
        when(commentService.addComment(eq(1L), any(CommentRequest.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/tasks/1/comments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.content").value("Test Comment"));
    }

    @Test
    void getTaskComments_ShouldReturnCommentList() throws Exception {
        // Given
        List<CommentResponse> comments = Arrays.asList(
            createCommentResponse(1L),
            createCommentResponse(2L)
        );
        when(commentService.getTaskComments(1L)).thenReturn(comments);

        // When & Then
        mockMvc.perform(get("/tasks/1/comments")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(2)))
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[1].id").value(2));
    }

    @Test
    void updateComment_ShouldReturnUpdatedComment() throws Exception {
        // Given
        CommentRequest request = createCommentRequest();
        CommentResponse response = createCommentResponse(1L);
        when(commentService.updateComment(eq(1L), eq(1L), any(CommentRequest.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(put("/tasks/1/comments/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.content").value("Test Comment"));
    }

    @Test
    void deleteComment_ShouldReturnOk() throws Exception {
        // Given
        doNothing().when(commentService).deleteComment(1L, 1L);

        // When & Then
        mockMvc.perform(delete("/tasks/1/comments/1")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
    }

    @Test
    void addComment_ShouldReturnError_WhenTaskNotFound() throws Exception {
        // Given
        CommentRequest request = createCommentRequest();
        when(commentService.addComment(eq(99L), any(CommentRequest.class)))
            .thenThrow(new RuntimeException("Görev bulunamadı"));

        // When & Then
        mockMvc.perform(post("/tasks/99/comments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Görev bulunamadı"));
    }

    @Test
    void updateComment_ShouldReturnError_WhenNoPermission() throws Exception {
        // Given
        CommentRequest request = createCommentRequest();
        when(commentService.updateComment(eq(1L), eq(1L), any(CommentRequest.class)))
            .thenThrow(new RuntimeException("Bu yorumu düzenleme yetkiniz yok"));

        // When & Then
        mockMvc.perform(put("/tasks/1/comments/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Bu yorumu düzenleme yetkiniz yok"));
    }

    private CommentRequest createCommentRequest() {
        CommentRequest request = new CommentRequest();
        request.setContent("Test Comment");
        return request;
    }

    private CommentResponse createCommentResponse(Long id) {
        return CommentResponse.builder()
            .id(id)
            .content("Test Comment")
            .userId(1L)
            .userName("Test User")
            .createdAt(LocalDateTime.now())
            .build();
    }
}