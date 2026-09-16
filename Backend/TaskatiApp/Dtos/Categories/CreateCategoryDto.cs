using System.ComponentModel.DataAnnotations;

namespace TaskatiApp.Dtos.Categories;

public record CreateCategoryDto(
    [Required][MaxLength(50)] string Name
);
