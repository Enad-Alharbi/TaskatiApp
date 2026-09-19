using TaskatiApp.Dtos.Categories;

namespace TaskatiApp.Services;

public interface ICategoryService
{
    Task<IReadOnlyList<CategoriesDto>> GetAllAsync();
    Task<CategoriesDto?> GetByIdAsync(int id);
    Task<IReadOnlyList<TasksUnderCategoryDto>?> GetTasksAsync(int id);
    Task<CategoriesDto> CreateAsync(CreateCategoryDto newCategory);
    Task<CategoriesDto?> UpdateAsync(int id, UpdateCategoryDto updateCategory);
    Task<CategoryDeleteResult> DeleteAsync(int id);
}

public enum CategoryDeleteResult
{
    NotFound,
    HasTasks,
    Deleted
}