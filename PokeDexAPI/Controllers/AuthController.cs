using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PokeDexAPI.Data;
using PokeDexAPI.Data.DTO;
using PokeDexAPI.Helpers;
using PokeDexAPI.Services;

namespace PokeDexAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly PokeDexDbContext _context;
    private readonly TokenProvider _tokenProvider;

    public AuthController(PokeDexDbContext context, TokenProvider tokenProvider)
    {
        _context = context;
        _tokenProvider = tokenProvider;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto loginRequest)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u =>
            u.Username == loginRequest.Username
        );

        if (user == null)
        {
            return Unauthorized("Invalid username.");
        }

        if (!PasswordHasher.VerifyPassword(loginRequest.Password, user.PasswordHash))
        {
            return Unauthorized("Invalid password.");
        }

        var token = _tokenProvider.GetJwtToken(user);
        return Ok(
            new
            {
                token,
                user = new
                {
                    id = user.Id,
                    username = user.Username,
                    role = user.Role,
                },
            }
        );
    }

    [Authorize]
    [HttpPost("validate")]
    public async Task<IActionResult> ValidateToken()
    {
        var authHeader = Request.Headers["Authorization"].ToString();
        Console.WriteLine("Authorization header: " + authHeader);

        var currentUserId = User.FindFirstValue("id");
        if (currentUserId == null)
        {
            return Unauthorized("Invalid token.");
        }

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id.ToString() == currentUserId);
        if (user == null)
        {
            return Unauthorized("User not found.");
        }

        return Ok(
            new
            {
                Id = user.Id,
                Username = user.Username,
                Role = user.Role,
            }
        );
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] CreateUserDto createUserDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var existingUser = await _context.Users.FirstOrDefaultAsync(u =>
            u.Username == createUserDto.Username || u.Email == createUserDto.Email
        );
        if (existingUser != null)
        {
            return Conflict("Username or email already exists.");
        }

        var passwordHash = PasswordHasher.HashPassword(createUserDto.Password);

        var profilePictureUrl = string.IsNullOrWhiteSpace(createUserDto.ProfilePictureUrl)
            ? "/profile-default.svg"
            : createUserDto.ProfilePictureUrl;

        var user = new Models.User
        {
            Username = createUserDto.Username,
            PasswordHash = passwordHash,
            Email = createUserDto.Email,
            Role = createUserDto.Role,
            ProfilePictureUrl = profilePictureUrl,
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = _tokenProvider.GetJwtToken(user);
        return Ok(
            new
            {
                message = "Registration successful.",
                token,
                user = new
                {
                    id = user.Id,
                    username = user.Username,
                    role = user.Role,
                    profilePictureUrl = user.ProfilePictureUrl,
                },
            }
        );
    }
}
