using System.ComponentModel.DataAnnotations;

namespace TaskatiApp.Dtos.Tasks;

public record CreateTaskDto(
    [Required][MaxLength(50)] string Title,
    [MaxLength(500)] string? Description,
    [Required][Range(1,50)] int CategoryId,
    [Required] DateOnly DueDate,
    bool IsCompleted
);