using Microsoft.AspNetCore.Mvc;
using TaskatiApp.Dtos.Categories;
using TaskatiApp.Services;

namespace TaskatiApp.Controllers;

[ApiController]
[Route("categories")]
public class CategoriesController(ICategoryService categoryService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<CategoriesDto>>> GetAll()
    {
        return Ok(await categoryService.GetAllAsync());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CategoriesDto>> GetById(int id)
    {
        var category = await categoryService.GetByIdAsync(id);

        return category is null ? NotFound() : Ok(category);
    }

    [HttpGet("{id:int}/tasks")]
    public async Task<ActionResult<IReadOnlyList<TasksUnderCategoryDto>>> GetTasks(int id)
    {
        var tasks = await categoryService.GetTasksAsync(id);

        return tasks is null ? NotFound() : Ok(tasks);
    }

    [HttpPost]
    public async Task<ActionResult<CategoriesDto>> Create(CreateCategoryDto newCategory)
    {
        var category = await categoryService.CreateAsync(newCategory);

        return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<CategoriesDto>> Update(int id, UpdateCategoryDto updateCategory)
    {
        var category = await categoryService.UpdateAsync(id, updateCategory);

        return category is null ? NotFound() : Ok(category);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        return await categoryService.DeleteAsync(id) switch
        {
            CategoryDeleteResult.NotFound => NotFound("There is no category with this Id"),
            CategoryDeleteResult.HasTasks => Conflict("Cannot delete a category that has tasks."),
            _ => NoContent()
        };
    }
}