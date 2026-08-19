using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces.Repositories;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public sealed class TaskItemRepository : ITaskItemRepository
    {
        private readonly ApplicationDbContext dbContext;

        public TaskItemRepository(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<int> CreateAsync(TaskItem taskItem)
        {
            await dbContext.TaskItems.AddAsync(taskItem);
            await dbContext.SaveChangesAsync();
            return taskItem.TaskId;


        }

        public async Task<bool> DeleteAsync(int id)
        {
           var task= await dbContext.TaskItems.FindAsync(id);
            if (task == null) return false;
             dbContext.TaskItems.Remove(task);
            await dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<IReadOnlyList<TaskItem>> FilterAsync(TaskPriorityEnum? status, TaskStatusEnum? priority)
        {
            var query = dbContext.TaskItems.Include(x => x.User).AsQueryable();
            if (status.HasValue)
            {
                query = query.Where(x => x.Status == status.Value);

            }
            if (priority.HasValue)
            {
                query = query.Where(x => x.Priority == priority.Value);
            }
            return await query.ToListAsync();
        }

        public async Task<IReadOnlyList<TaskItem>> GetAllAsync()
        {
            return await dbContext.TaskItems.Include(x=>x.User).ToListAsync();
        }

        public async Task<TaskItem?> GetByIdAsync(int id)
        {
            return await dbContext.TaskItems.Include(x => x.User).FirstOrDefaultAsync(x=>x.TaskId==id);

        }

        public async Task<bool> UpdateAsync(TaskItem taskItem)
        {
            var taskUpdate = await dbContext.TaskItems.FindAsync(taskItem.TaskId);
            if (taskUpdate == null) return false;
            taskUpdate.Title = taskItem.Title;
            taskUpdate.Description = taskItem.Description;
            taskUpdate.DueDate = taskItem.DueDate;
            taskUpdate.Status = taskItem.Status;
            taskUpdate.Priority = taskItem.Priority;
            taskUpdate.UserId = taskItem.UserId;
            await dbContext.SaveChangesAsync();
            return true;
        }
    }
}
