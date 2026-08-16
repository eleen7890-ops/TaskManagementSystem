using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Enums;

namespace Domain.Entities
{
   public class TaskItem
    {
        [Key]
        public int TaskId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }= DateTime.UtcNow;
        public DateTime ? DueDate { get; set; }
        public TaskStatusEnum ? Status { get; set; }
        public TaskPriorityEnum ? Priority { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }

    }
}
