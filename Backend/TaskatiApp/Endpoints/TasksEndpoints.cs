using Microsoft.EntityFrameworkCore;
using TaskatiApp.Data;
using TaskatiApp.Dtos.Categories;
using TaskatiApp.Dtos.Tasks;
using TaskatiApp.Models;

namespace TaskatiApp.Endpoints;

public static class TasksEndpoints
{
    public static void MapTasksEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/tasks");

        string GetTaskEndpointName = "GetTask";

        // GET /tasks (Retrieve all tasks)
        group.MapGet("/", async (TaskatiAppContext dbContext)
             => await dbContext.Tasks.Select(task => new TasksDetailsDto(
                                        task.Id, 
                                        task.Title,
                                        task.Description,
                                        task.DueDate,
                                        task.IsCompleted,
                                        new CategoriesDto(task.Category!.Id, task.Category.Name)
                                     ))
                                     .AsNoTracking()
                                     .ToListAsync()
              );

        // GET /tasks/{id} (Retireve specific task)
        group.MapGet("/{id}", async (int id, TaskatiAppContext dbContext) =>
        {
            var task = await dbContext.Tasks.FindAsync(id);

            return task is null ? 
            Results.NotFound() : 
            Results.Ok(new TasksDto(
                task.Id,
                task.Title,
                task.Description,
                task.CategoryId,
                task.DueDate,
                task.IsCompleted
            ));
        }).WithName(GetTaskEndpointName);

        // POST /tasks (Create new task)
        group.MapPost("/", async (CreateTaskDto newTask, TaskatiAppContext dbContext) =>
        {
            var categoryExist = await dbContext.Categories.AnyAsync(category => category.Id == newTask.CategoryId);

            if(!categoryExist)
            {
                return Results.Conflict("There is no category with this Id");
            }

            AppTask task = new()
            {
                Title = newTask.Title,
                Description = newTask.Description,
                CategoryId = newTask.CategoryId,
                DueDate = newTask.DueDate,
                IsCompleted = newTask.IsCompleted,
            };

            dbContext.Tasks.Add(task);
            await dbContext.SaveChangesAsync();

            TasksDto taskDto = new(
                task.Id,
                task.Title,
                task.Description,
                task.CategoryId,
                task.DueDate,
                task.IsCompleted
            );

            return Results.CreatedAtRoute(GetTaskEndpointName, new { id = taskDto.Id}, taskDto);
        });

        // PUT /tasks/{id} (Update existing task)
        group.MapPut("/{id}", async (int id, UpdateTaskDto taskUpdate, TaskatiAppContext dbContext) =>
        {
            var existingTask = await dbContext.Tasks.FindAsync(id);

            if(existingTask is null)
            {
                return Results.NotFound();
            }

            var categoryExist = await dbContext.Categories.AnyAsync(category => category.Id == taskUpdate.CategoryId);
            
            if(!categoryExist)
            {
                return Results.Conflict("There is no category with this Id");
            }

            existingTask.Title = taskUpdate.Title;
            existingTask.Description = taskUpdate.Description;
            existingTask.CategoryId = taskUpdate.CategoryId;
            existingTask.DueDate = taskUpdate.DueDate;
            existingTask.IsCompleted = taskUpdate.IsCompleted;

            await dbContext.SaveChangesAsync();

            return Results.Ok(await dbContext.Tasks
                                             .Where(task => task.Id == existingTask.Id)
                                             .Select(task => new TasksDetailsDto(
                                              task.Id,
                                              task.Title,
                                              task.Description,
                                              task.DueDate,
                                              task.IsCompleted,
                                              new CategoriesDto(task.Category!.Id, task.Category.Name)
                                             ))
                                             .AsNoTracking()
                                             .SingleOrDefaultAsync()
                                             );

        });

        // DELETE /tasks/{id}
        group.MapDelete("/{id}", async (int id, TaskatiAppContext dbContext) =>
        {
            var deletedRows = await dbContext.Tasks.Where(task => task.Id == id)
                                                   .ExecuteDeleteAsync();

            if(deletedRows == 0)
            {
                return Results.NotFound();
            }

            return Results.NoContent();
        });
    }
}
