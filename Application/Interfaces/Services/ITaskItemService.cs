using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos.TaskItemDtos;
using Application.Dtos.UserDtos;
using Domain.Entities;
using Domain.Enums;

namespace Application.Interfaces.Services
{
     public interface ITaskItemService
    {
        Task<IReadOnlyList<TaskItemDto>> GetAllAsync();
        Task<DetailsTaskItemDto?> GetByIdAsync(int id);
        Task<IReadOnlyList<TaskItemDto>> FilterAsync(TaskPriorityEnum? status, TaskStatusEnum? priority);
        Task<int> CreateAsync(CreateTaskItemDto createTaskItemDto);
        Task<bool> UpdateAsync(int id,UpdateTaskItemDto updateTaskItemDto);
        Task<bool> DeleteAsync(int id);
    }
}
