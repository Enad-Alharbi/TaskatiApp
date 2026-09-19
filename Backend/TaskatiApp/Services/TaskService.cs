using Microsoft.EntityFrameworkCore;
using TaskatiApp.Data;
using TaskatiApp.Dtos.Categories;
using TaskatiApp.Dtos.Tasks;
using TaskatiApp.Models;

namespace TaskatiApp.Services;

public class TaskService(TaskatiAppContext dbContext) : ITaskService
{
    public async Task<IReadOnlyList<TasksDetailsDto>> GetAllAsync()
    {
        return await dbContext.Tasks
            .Select(task => new TasksDetailsDto(
                task.Id,
                task.Title,
                task.Description,
                task.DueDate,
                task.IsCompleted,
                new CategoriesDto(task.Category!.Id, task.Category.Name)))
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<TasksDto?> GetByIdAsync(int id)
    {
        var task = await dbContext.Tasks.FindAsync(id);

        return task is null ? null : ToDto(task);
    }

    public async Task<(TasksDto? Task, bool CategoryExists)> CreateAsync(CreateTaskDto newTask)
    {
        if (!await CategoryExistsAsync(newTask.CategoryId))
        {
            return (null, false);
        }

        var task = new AppTask
        {
            Title = newTask.Title,
            Description = newTask.Description,
            CategoryId = newTask.CategoryId,
            DueDate = newTask.DueDate,
            IsCompleted = newTask.IsCompleted
        };

        dbContext.Tasks.Add(task);
        await dbContext.SaveChangesAsync();

        return (ToDto(task), true);
    }

    public async Task<(TasksDetailsDto? Task, bool CategoryExists)> UpdateAsync(int id, UpdateTaskDto taskUpdate)
    {
        var existingTask = await dbContext.Tasks.FindAsync(id);

        if (existingTask is null)
        {
            return (null, true);
        }

        if (!await CategoryExistsAsync(taskUpdate.CategoryId))
        {
            return (null, false);
        }

        existingTask.Title = taskUpdate.Title;
        existingTask.Description = taskUpdate.Description;
        existingTask.CategoryId = taskUpdate.CategoryId;
        existingTask.DueDate = taskUpdate.DueDate;
        existingTask.IsCompleted = taskUpdate.IsCompleted;

        await dbContext.SaveChangesAsync();

        return (await dbContext.Tasks
            .Where(task => task.Id == existingTask.Id)
            .Select(task => new TasksDetailsDto(
                task.Id,
                task.Title,
                task.Description,
                task.DueDate,
                task.IsCompleted,
                new CategoriesDto(task.Category!.Id, task.Category.Name)))
            .AsNoTracking()
            .SingleAsync(), true);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await dbContext.Tasks
            .Where(task => task.Id == id)
            .ExecuteDeleteAsync() > 0;
    }

    private async Task<bool> CategoryExistsAsync(int categoryId)
    {
        return await dbContext.Categories.AnyAsync(category => category.Id == categoryId);
    }

    private static TasksDto ToDto(AppTask task) => new(
        task.Id,
        task.Title,
        task.Description,
        task.CategoryId,
        task.DueDate,
        task.IsCompleted);

}