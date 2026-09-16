using System.ComponentModel.DataAnnotations;

namespace TaskatiApp.Dtos.Categories;

public record TasksUnderCategoryDto(
    [Required] int Id,
    [Required][MaxLength(50)] string Title,
    [MaxLength(500)] string? Description,
    [Required] DateOnly DueDate,
    bool IsCompleted,
    [Required] CategoriesDto Category
);
