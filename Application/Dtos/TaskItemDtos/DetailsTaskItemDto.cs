using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Enums;

namespace Application.Dtos.TaskItemDtos
{
    public class DetailsTaskItemDto
    {
        public int TaskId { get; set; }

        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public TaskStatusEnum? Status { get; set; }
        public TaskPriorityEnum? Priority { get; set; }
        public DateTime? DueDate { get; set; }
        public string? FullName { get; set; }

    }
}
