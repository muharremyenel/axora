package com.axora.backend.unit.service;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.axora.backend.dto.category.CategoryRequest;
import com.axora.backend.dto.category.CategoryResponse;
import com.axora.backend.entity.Category;
import com.axora.backend.repository.CategoryRepository;
import com.axora.backend.service.CategoryService;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryService categoryService;

    @Test
    void createCategory_ShouldCreateAndReturnCategory() {
        // Given
        CategoryRequest request = new CategoryRequest("Test Category", "#000000", "Test Description");
        Category category = Category.builder()
            .name("Test Category")
            .colorCode("#000000")
            .description("Test Description")
            .active(true)
            .build();
        
        when(categoryRepository.existsByName("Test Category")).thenReturn(false);
        when(categoryRepository.save(any(Category.class))).thenReturn(category);

        // When
        CategoryResponse response = categoryService.createCategory(request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getName()).isEqualTo("Test Category");
    }

    @Test
    void getAllCategories_ShouldReturnActiveCategories() {
        // Given
        Category category = Category.builder()
            .name("Test Category")
            .colorCode("#000000")
            .description("Test Description")
            .active(true)
            .build();
        
        when(categoryRepository.findByActiveTrue()).thenReturn(List.of(category));

        // When
        List<CategoryResponse> categories = categoryService.getAllCategories();

        // Then
        assertThat(categories).isNotEmpty();
        assertThat(categories.get(0).getName()).isEqualTo("Test Category");
    }
} 