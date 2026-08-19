using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Enums
{
    public enum TaskStatusEnum
    {
        [Display(Name = "To Do")]

        ToDo = 1,
        [Display(Name = "In Progress")]

        InProgress = 2,
        [Display(Name = "Completed")]

        Completed = 3,
    }
}
