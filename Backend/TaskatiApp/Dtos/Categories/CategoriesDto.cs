using System.ComponentModel.DataAnnotations;

namespace TaskatiApp.Dtos.Categories;

public record CategoriesDto(
    [Required] int Id,
    [Required][MaxLength(50)] string Name
);
