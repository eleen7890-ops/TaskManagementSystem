using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Enums;

namespace Application.Dtos.TaskItemDtos
{
    public class TaskItemDto
    {
        public string Title { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
        public string? FullName { get; set; }

    }
}
