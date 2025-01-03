package com.axora.backend.integration.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.axora.backend.controller.CategoryController;
import com.axora.backend.dto.category.CategoryRequest;
import com.axora.backend.dto.category.CategoryResponse;
import com.axora.backend.security.JwtAuthenticationFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import jakarta.persistence.EntityNotFoundException;
import com.axora.backend.service.CategoryService;
import com.axora.backend.security.JwtService;
import org.springframework.security.authentication.AuthenticationProvider;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@WebMvcTest(CategoryController.class)
@AutoConfigureMockMvc(addFilters = false)
class CategoryControllerTest {

    @MockBean
    private CategoryService categoryService;

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
    void createCategory_ShouldReturnCreatedCategory() throws Exception {
        // Given
        CategoryRequest request = createCategoryRequest();
        CategoryResponse response = createCategoryResponse(1L);

        when(categoryService.createCategory(any(CategoryRequest.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.name").value("Test Category"));
    }

    @Test
    void getAllCategories_ShouldReturnCategoryList() throws Exception {
        // Given
        List<CategoryResponse> categories = Arrays.asList(
            createCategoryResponse(1L),
            createCategoryResponse(2L)
        );

        when(categoryService.getAllCategories()).thenReturn(categories);

        // When & Then
        mockMvc.perform(get("/categories")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(2)))
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[1].id").value(2));
    }

    @Test
    void getCategoryById_ShouldReturnCategory() throws Exception {
        // Given
        CategoryResponse response = createCategoryResponse(1L);
        when(categoryService.getCategoryById(1L)).thenReturn(response);

        // When & Then
        mockMvc.perform(get("/categories/1")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.name").value("Test Category"));
    }

    @Test
    void updateCategory_ShouldReturnUpdatedCategory() throws Exception {
        // Given
        CategoryRequest request = createCategoryRequest();
        CategoryResponse response = createCategoryResponse(1L);

        when(categoryService.updateCategory(eq(1L), any(CategoryRequest.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(put("/categories/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.name").value("Test Category"));
    }

    @Test
    void deleteCategory_ShouldReturnNoContent() throws Exception {
        // Given
        doNothing().when(categoryService).deleteCategory(1L);

        // When & Then
        mockMvc.perform(delete("/categories/1")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
    }

    @Test
    void createCategory_ShouldReturnError_WhenNameExists() throws Exception {
        // Given
        CategoryRequest request = createCategoryRequest();
        when(categoryService.createCategory(any(CategoryRequest.class)))
            .thenThrow(new RuntimeException("Bu isimde bir kategori zaten mevcut"));

        // When & Then
        mockMvc.perform(post("/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Bu isimde bir kategori zaten mevcut"));
    }

    @Test
    void createCategory_ShouldReturnError_WhenNameIsBlank() throws Exception {
        // Given
        CategoryRequest request = CategoryRequest.builder()
            .name("")
            .colorCode("#FF0000")
            .description("Test Description")
            .build();

        // When & Then
        mockMvc.perform(post("/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
    }

    @Test
    void createCategory_ShouldReturnError_WhenNameIsTooShort() throws Exception {
        // Given
        CategoryRequest request = CategoryRequest.builder()
            .name("a")
            .colorCode("#FF0000")
            .description("Test Description")
            .build();

        // When & Then
        mockMvc.perform(post("/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
    }

    @Test
    void getCategoryById_ShouldReturnError_WhenCategoryNotFound() throws Exception {
        // Given
        when(categoryService.getCategoryById(99L))
            .thenThrow(new EntityNotFoundException("Kategori bulunamadı"));

        // When & Then
        mockMvc.perform(get("/categories/99")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Kategori bulunamadı"));
    }

    private CategoryRequest createCategoryRequest() {
        return CategoryRequest.builder()
            .name("Test Category")
            .colorCode("#FF0000")
            .description("Test Description")
            .build();
    }

    private CategoryResponse createCategoryResponse(Long id) {
        return CategoryResponse.builder()
            .id(id)
            .name("Test Category")
            .colorCode("#FF0000")
            .description("Test Description")
            .active(true)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();
    }
} 