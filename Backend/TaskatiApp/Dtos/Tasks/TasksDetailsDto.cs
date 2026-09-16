using System.ComponentModel.DataAnnotations;
using TaskatiApp.Dtos.Categories;


namespace TaskatiApp.Dtos.Tasks;

public record TasksDetailsDto(
    [Required] int Id,
    [Required][MaxLength(50)] string Title,
    [MaxLength(500)] string? Description,
    [Required] DateOnly DueDate,
    bool IsCompleted,
    [Required] CategoriesDto Category
);