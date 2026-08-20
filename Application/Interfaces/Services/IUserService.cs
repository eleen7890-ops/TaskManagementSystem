using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos.TaskItemDtos;
using Application.Dtos.UserDtos;
using Domain.Enums;

namespace Application.Interfaces.Services
{
  public interface IUserService
    {
        Task<IReadOnlyList<UserDto>> GetAllAsync();
        Task<DetailsUserDto?> GetByIdAsync(int id);
        Task<int> CreateAsync(CreateUserDto createUserDto);
        Task<bool> UpdateAsync(int id,UpdateUserDto updateUserDto);
        Task<bool> DeleteAsync(int id);
    }
}
