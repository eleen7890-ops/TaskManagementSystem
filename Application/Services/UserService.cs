using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos.TaskItemDtos;
using Application.Dtos.UserDtos;
using Application.Interfaces.Services;
using Domain.Entities;

namespace Application.Services
{
  public class UserService : IUserService
    {
        private readonly IUserRepository Repository;

        public UserService(IUserRepository repository)
        {
            Repository = repository;
        }

        public async Task<int> CreateAsync(CreateUserDto createUserDto)
        {
            var createUsers = new User
            {
                Email = createUserDto.Email,
                FullName = createUserDto.FullName

            };
               return  await Repository.CreateAsync(createUsers);

        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await Repository.DeleteAsync(id);
        }

        public async Task<IReadOnlyList<UserDto>> GetAllAsync()
        {
            var users = await Repository.GetAllAsync();
            return users.Select(user => new UserDto
            {
                UserId=user.UserId,
                Email = user.Email,
                FullName=user.FullName
            }).ToList();
        }

        public async Task<DetailsUserDto?> GetByIdAsync(int id)
        {
            var user = await Repository.GetByIdAsync(id);
            if (user == null)
                return null;
            return new DetailsUserDto
            {
                UserId = user.UserId,
                FullName = user.FullName,
                Email = user.Email,

            };
        }

        public async Task<bool> UpdateAsync(int id, UpdateUserDto updateUserDto)
        {
            var userUpdate = new User
            {
                UserId = id,

                Email = updateUserDto.Email,
                FullName = updateUserDto.FullName
            };
            return await Repository.UpdateAsync(userUpdate);
        }
    }
}
