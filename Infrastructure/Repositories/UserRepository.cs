using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces.Services;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public sealed class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext dbContext;

        public UserRepository(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<int> CreateAsync(User user)
        {
           
            await dbContext.Users.AddAsync(user);
           await dbContext.SaveChangesAsync();
            return user.UserId;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var user= dbContext.Users.Find(id);
            if (user == null) return false;
            dbContext.Users.Remove(user);
            await dbContext.SaveChangesAsync();
            return true;

        }

        public async Task<IReadOnlyList<User>> GetAllAsync()
        {
            return await dbContext.Users.ToListAsync();

        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await dbContext.Users.FirstOrDefaultAsync(x => x.UserId == id);
        }

        public async Task<bool> UpdateAsync(User user)
        {
            var updateUser = await dbContext.Users.FindAsync(user.UserId);
            if (updateUser == null) return false;
            updateUser.FullName = user.FullName;
            updateUser.Email = user.Email;
            await dbContext.SaveChangesAsync();
            return true;
        }
    }
}
