using Application.Dtos.UserDtos;
using Application.Interfaces.Services;
using Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace TaskManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService userService;

        public UserController(IUserService userService)
        {
            this.userService = userService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await userService.GetAllAsync();
            return Ok(users);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await userService.GetByIdAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }
        [HttpPost]
        public async Task<IActionResult> CreateUser(CreateUserDto createUserDto)
        {
            var createdUser = await userService.CreateAsync(createUserDto);
            return Ok(createdUser);

        }
        [HttpPut("{id}")] 
        public async Task<IActionResult> UpdateUser(int id,UpdateUserDto updateUserDto)
        {
            var updatedUser = await userService.UpdateAsync(id, updateUserDto);
            if (!updatedUser) return NotFound();
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var deletedUser = await userService.DeleteAsync(id);
            if (!deletedUser)
            {
                return Conflict(new
                {
                    message = "This user cannot be deleted because they have assigned tasks."
                });
            }
            return NoContent();
        }
    }
}

