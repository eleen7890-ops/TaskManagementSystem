using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Enums;

namespace Application.Dtos.TaskItemDtos
{
   public class CreateTaskItemDto
    {
        [Required(ErrorMessage ="Title Is Required")]
        [MinLength(3, ErrorMessage = "Title Must Be At Least 3 Characters")]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;
        [Required(ErrorMessage = "Due Date Is Required")]

        public DateTime DueDate { get; set; }
        [Required(ErrorMessage = "Status Is Required")]

        public TaskPriorityEnum Status { get; set; }
        [Required(ErrorMessage = "Priority Is Required")]
        public TaskStatusEnum Priority { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "User Is Required")]
        public int UserId { get; set; }
       
    }
}
