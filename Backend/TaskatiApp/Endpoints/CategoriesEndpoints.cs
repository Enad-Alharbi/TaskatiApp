using Microsoft.EntityFrameworkCore;
using TaskatiApp.Data;
using TaskatiApp.Dtos.Categories;
using TaskatiApp.Models;

namespace TaskatiApp.Endpoints;

public static class CategoriesEndpoints
{
    public static void MapCategoriesEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/categories");

        string GetCategoryEndpointName = "GetCategory";

        // GET /categories (Retrieve all categories)
        group.MapGet("/", async (TaskatiAppContext dbContext)
            => await dbContext.Categories.Select(category => new CategoriesDto(category.Id, category.Name))
                                         .AsNoTracking()
                                         .ToListAsync()
         );

        // POST /categories (Create new category)
        group.MapPost("/", async (CreateCategoryDto newCategory, TaskatiAppContext dbContext) =>
        {
            Category category = new()
            {
                Name = newCategory.Name
            };

            dbContext.Categories.Add(category);
            await dbContext.SaveChangesAsync();

            CategoriesDto categoryDto = new(category.Id, category.Name);

            return Results.CreatedAtRoute(GetCategoryEndpointName, new {id = categoryDto.Id}, categoryDto);
        });

        // GET /categories/{id} (Retrieve category by id)
        group.MapGet("/{id}", async (int id, TaskatiAppContext dbContext) =>
        {
            var category = await dbContext.Categories.FindAsync(id);

            return category is null ? 
            Results.NotFound() :
            Results.Ok(new CategoriesDto(category.Id, category.Name));
        }).WithName(GetCategoryEndpointName);

        // GET /categories/{id}/tasks (Retireve all tasks under spesific category)
        group.MapGet("/{id}/tasks", async (int id, TaskatiAppContext dbContext) =>
        {
            if (await dbContext.Categories.FindAsync(id) is null)
            {
                return Results.NotFound();
            }
            var tasksUnderCategory = await dbContext.Tasks
                                                    .Where(task => task.CategoryId == id)
                                                    .Select(task => new TasksUnderCategoryDto(
                                                        task.Id,
                                                        task.Title,
                                                        task.Description,
                                                        task.DueDate,
                                                        task.IsCompleted,
                                                        new CategoriesDto(task.Category!.Id, task.Category.Name)
                                                    ))
                                                    .AsNoTracking()
                                                    .ToListAsync();

            

            return Results.Ok(tasksUnderCategory);
        }
        );

        // PUT /categories/{id} (Update existing category)
        group.MapPut("/{id}", async (int id, UpdateCategoryDto updateCategory,TaskatiAppContext dbContext) =>
        {
            var existingCategory = await dbContext.Categories.FindAsync(id);

            if(existingCategory is null)
            {
                return Results.NotFound();
            }

            existingCategory.Name = updateCategory.Name;

            await dbContext.SaveChangesAsync();

            return Results.Ok(new CategoriesDto(existingCategory.Id, existingCategory.Name));
        });

        // DELETE /categories/{id} (Delete existing category)
        group.MapDelete("/{id}", async (int id, TaskatiAppContext dbContext) =>
        {
            var deletedCategory = await dbContext.Categories.FindAsync(id);

            if(deletedCategory is null)
            {
                return Results.NotFound("There is no category with this Id");
            }

            var hasTasks = await dbContext.Tasks.AnyAsync(task => task.CategoryId == deletedCategory.Id);

            if(hasTasks)
            {
                return Results.Conflict("Cannot delete a category that has tasks.");
            }

            await dbContext.Categories.Where(category => category.Id == deletedCategory.Id).ExecuteDeleteAsync();

            return Results.NoContent();
        });
    }
}