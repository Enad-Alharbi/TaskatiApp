using TaskatiApp.Dtos.Tasks;

namespace TaskatiApp.Services;

public interface ITaskService
{
    Task<IReadOnlyList<TasksDetailsDto>> GetAllAsync();
    Task<TasksDto?> GetByIdAsync(int id);
    Task<(TasksDto? Task, bool CategoryExists)> CreateAsync(CreateTaskDto newTask);
    Task<(TasksDetailsDto? Task, bool CategoryExists)> UpdateAsync(int id, UpdateTaskDto taskUpdate);
    Task<bool> DeleteAsync(int id);
}