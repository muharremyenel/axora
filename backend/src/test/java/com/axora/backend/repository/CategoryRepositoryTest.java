package com.axora.backend.repository;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.axora.backend.entity.Category;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
class CategoryRepositoryTest {

    @Autowired
    private CategoryRepository categoryRepository;

    @Test
    void shouldLoadContext() {
        assertThat(categoryRepository).isNotNull();
    }

    @Test
    void findByName_ShouldReturnCategory() {
        // Given
        Category category = Category.builder()
            .name("Test Category")
            .description("Test Description")
            .colorCode("#000000")
            .active(true)
            .build();
        categoryRepository.save(category);

        // When
        Optional<Category> found = categoryRepository.findByName("Test Category");

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Test Category");
    }

    @Test
    void findByActiveTrue_ShouldReturnActiveCategories() {
        // Given
        Category activeCategory = Category.builder()
            .name("Active Category")
            .description("Active Description")
            .colorCode("#000000")
            .active(true)
            .build();
        Category inactiveCategory = Category.builder()
            .name("Inactive Category")
            .description("Inactive Description")
            .colorCode("#000000")
            .active(false)
            .build();
        categoryRepository.saveAll(List.of(activeCategory, inactiveCategory));

        // When
        List<Category> activeCategories = categoryRepository.findByActiveTrue();

        // Then
        assertThat(activeCategories).isNotEmpty();
        assertThat(activeCategories).allMatch(Category::isActive);
    }
}