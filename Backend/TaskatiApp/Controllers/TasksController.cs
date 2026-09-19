using Microsoft.AspNetCore.Mvc;
using TaskatiApp.Dtos.Tasks;
using TaskatiApp.Services;

namespace TaskatiApp.Controllers;

[ApiController]
[Route("tasks")]
public class TasksController(ITaskService taskService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<TasksDetailsDto>>> GetAll()
    {
        return Ok(await taskService.GetAllAsync());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TasksDto>> GetById(int id)
    {
        var task = await taskService.GetByIdAsync(id);

        return task is null ? NotFound() : Ok(task);
    }

    [HttpPost]
    public async Task<ActionResult<TasksDto>> Create(CreateTaskDto newTask)
    {
        var result = await taskService.CreateAsync(newTask);

        if (!result.CategoryExists)
        {
            return Conflict("There is no category with this Id");
        }

        return CreatedAtAction(nameof(GetById), new { id = result.Task!.Id }, result.Task);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<TasksDetailsDto>> Update(int id, UpdateTaskDto taskUpdate)
    {
        var result = await taskService.UpdateAsync(id, taskUpdate);

        if (result.Task is null && result.CategoryExists)
        {
            return NotFound();
        }

        if (!result.CategoryExists)
        {
            return Conflict("There is no category with this Id");
        }

        return Ok(result.Task);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        return await taskService.DeleteAsync(id) ? NoContent() : NotFound();
    }
}