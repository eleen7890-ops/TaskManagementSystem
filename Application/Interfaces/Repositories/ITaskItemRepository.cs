using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Enums;

namespace Application.Interfaces.Repositories
{
    public interface ITaskItemRepository
    {
        Task<IReadOnlyList<TaskItem>> GetAllAsync();
        Task<TaskItem?> GetByIdAsync(int id);
        Task<IReadOnlyList<TaskItem>> FilterAsync(TaskStatusEnum? status,TaskPriorityEnum? priority);
        Task<int> CreateAsync(TaskItem taskItem);
        Task<bool> UpdateAsync(TaskItem taskItem);
        Task<bool> DeleteAsync(int id);

    }
}
