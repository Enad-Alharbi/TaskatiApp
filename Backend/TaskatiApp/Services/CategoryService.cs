using Microsoft.EntityFrameworkCore;
using TaskatiApp.Data;
using TaskatiApp.Dtos.Categories;
using TaskatiApp.Models;

namespace TaskatiApp.Services;

public class CategoryService(TaskatiAppContext dbContext) : ICategoryService
{
    public async Task<IReadOnlyList<CategoriesDto>> GetAllAsync()
    {
        return await dbContext.Categories
            .Select(category => new CategoriesDto(category.Id, category.Name))
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<CategoriesDto?> GetByIdAsync(int id)
    {
        var category = await dbContext.Categories.FindAsync(id);

        return category is null ? null : new CategoriesDto(category.Id, category.Name);
    }

    public async Task<IReadOnlyList<TasksUnderCategoryDto>?> GetTasksAsync(int id)
    {
        if (await dbContext.Categories.FindAsync(id) is null)
        {
            return null;
        }

        return await dbContext.Tasks
            .Where(task => task.CategoryId == id)
            .Select(task => new TasksUnderCategoryDto(
                task.Id,
                task.Title,
                task.Description,
                task.DueDate,
                task.IsCompleted,
                new CategoriesDto(task.Category!.Id, task.Category.Name)))
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<CategoriesDto> CreateAsync(CreateCategoryDto newCategory)
    {
        var category = new Category { Name = newCategory.Name };

        dbContext.Categories.Add(category);
        await dbContext.SaveChangesAsync();

        return new CategoriesDto(category.Id, category.Name);
    }

    public async Task<CategoriesDto?> UpdateAsync(int id, UpdateCategoryDto updateCategory)
    {
        var existingCategory = await dbContext.Categories.FindAsync(id);

        if (existingCategory is null)
        {
            return null;
        }

        existingCategory.Name = updateCategory.Name;
        await dbContext.SaveChangesAsync();

        return new CategoriesDto(existingCategory.Id, existingCategory.Name);
    }

    public async Task<CategoryDeleteResult> DeleteAsync(int id)
    {
        var category = await dbContext.Categories.FindAsync(id);

        if (category is null)
        {
            return CategoryDeleteResult.NotFound;
        }

        if (await dbContext.Tasks.AnyAsync(task => task.CategoryId == category.Id))
        {
            return CategoryDeleteResult.HasTasks;
        }

        await dbContext.Categories
            .Where(existingCategory => existingCategory.Id == category.Id)
            .ExecuteDeleteAsync();

        return CategoryDeleteResult.Deleted;
    }
}