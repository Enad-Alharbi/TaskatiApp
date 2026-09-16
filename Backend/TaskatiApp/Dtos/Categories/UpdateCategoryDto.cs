using System.ComponentModel.DataAnnotations;

namespace TaskatiApp.Dtos.Categories;

public record UpdateCategoryDto(
    [Required][MaxLength(50)] string Name
);
