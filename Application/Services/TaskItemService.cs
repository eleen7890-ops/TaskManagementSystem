using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos.TaskItemDtos;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Domain.Entities;
using Domain.Enums;

namespace Application.Services
{
    public class TaskItemService : ITaskItemService
    {
        private readonly ITaskItemRepository repository;

        public TaskItemService(ITaskItemRepository repository)
        {
            this.repository = repository;
        }
        public async Task<int> CreateAsync(CreateTaskItemDto createTaskItemDto)
        {
            var createItem = new TaskItem
            {
                Title = createTaskItemDto.Title,
                Description = createTaskItemDto.Description,
                DueDate = createTaskItemDto.DueDate,
                Status = createTaskItemDto.Status,
                Priority = createTaskItemDto.Priority,
                UserId = createTaskItemDto.UserId

            };
            return await repository.CreateAsync(createItem);
        }

        public Task<bool> DeleteAsync(int id)
        {
            return repository.DeleteAsync(id);
        }

        public async Task<IReadOnlyList<TaskItemDto>> FilterAsync(TaskStatusEnum? status, TaskPriorityEnum? priority)
        {
            var tasks = await repository.FilterAsync(priority, status);
            return tasks.Select(item => new TaskItemDto
            {
                TaskId = item.TaskId,
                Title = item.Title,
                DueDate = item.DueDate,
                FullName = item.User?.FullName,
                Status = item.Status,
                Priority = item.Priority

            }).ToList();
        }

        public async Task<IReadOnlyList<TaskItemDto>> GetAllAsync()
        {
            var tasks = await repository.GetAllAsync();
            return tasks.Select(item => new TaskItemDto {TaskId=item.TaskId, DueDate = item.DueDate,Title=item.Title, FullName = item.User.FullName,
                Status = item.Status,
                Priority = item.Priority
            }).ToList();
        }

        public async Task<DetailsTaskItemDto?> GetByIdAsync(int id)
        {
            var task = await repository.GetByIdAsync(id);
            if (task == null) return null;
            return new DetailsTaskItemDto
            {
                Description = task.Description,
                DueDate = task.DueDate,
                Priority = task.Priority,
                Title = task.Title,
                Status = task.Status,
                FullName = task.User.FullName,
                TaskId = task.TaskId,
                
            };
        }

        public async Task<bool> UpdateAsync(int id, UpdateTaskItemDto updateTaskItemDto)
        {
            var taskUpdate = new TaskItem
            {
                
                Title = updateTaskItemDto.Title,
                Description = updateTaskItemDto.Description,
                DueDate = updateTaskItemDto.DueDate,
                Status = updateTaskItemDto.Status,
                Priority = updateTaskItemDto.Priority,
                UserId = updateTaskItemDto.UserId,
                TaskId = id,
            };
            return await repository.UpdateAsync(taskUpdate);
        }
    }
}
