using Application.Dtos.TaskItemDtos;
using Application.Interfaces.Services;
using Domain.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace TaskManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskItemController : ControllerBase
    {
        private readonly ITaskItemService taskItemService;

        public TaskItemController(ITaskItemService taskItemService)
        {
            this.taskItemService = taskItemService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var tasks = await taskItemService.GetAllAsync();
            return Ok(tasks);

        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var task = await taskItemService.GetByIdAsync(id);
            return Ok(task);

        }
        [HttpGet("filter")]
        public async Task<IActionResult> Filter([FromQuery] TaskStatusEnum? status,[FromQuery] TaskPriorityEnum? priority)
        {
            var tasks = await taskItemService.FilterAsync(status, priority);

            return Ok(tasks);
        }
        [HttpPost]
        public async Task<IActionResult> CreateTask(CreateTaskItemDto createTaskItemDto)
        {
            var createdTask = await taskItemService.CreateAsync(createTaskItemDto);
            return Ok(createdTask);

        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, UpdateTaskItemDto updateTaskItemDto)
        {
            var updatedTask = await taskItemService.UpdateAsync(id, updateTaskItemDto);
            if (!updatedTask) return NotFound();
            return NoContent();

        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var deletedTask = await taskItemService.DeleteAsync(id);
            if (!deletedTask) return NotFound();
            return NoContent();

        }

    }
}
