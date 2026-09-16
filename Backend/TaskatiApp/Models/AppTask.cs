namespace TaskatiApp.Models;

public class AppTask
{
    public int Id { get; set; }

    public required string Title { get; set; }

    public string? Description { get; set; }

    public Category? Category { get; set; }

    public int CategoryId { get; set; }

    public DateOnly DueDate { get; set; }

    public bool IsCompleted { get; set; }
}
