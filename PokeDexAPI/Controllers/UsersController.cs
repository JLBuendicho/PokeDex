using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PokeDexAPI.Data;
using PokeDexAPI.Models;

namespace PokeDexAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly PokeDexDbContext _context;

    public UsersController(PokeDexDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        var users = await _context.Users.ToListAsync();
        return Ok(users);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<User>> GetUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound();

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        Console.WriteLine($"User ID Claim: {userIdClaim}");
        Console.WriteLine($"User ID: {user.Id}");
        if (userIdClaim == null || user.Id.ToString() != userIdClaim)
            return Forbid();

        var form = await Request.ReadFormAsync();
        var username = form["username"].ToString();
        var currentPassword = form["currentPassword"].ToString();
        var newPassword = form["newPassword"].ToString();
        var file = form.Files["profilePicture"];

        // Validate current password
        if (!Helpers.PasswordHasher.VerifyPassword(currentPassword, user.PasswordHash))
            return BadRequest(new { message = "Current password is incorrect." });

        // Update username
        if (!string.IsNullOrWhiteSpace(username) && username != user.Username)
            user.Username = username;

        // Update password if provided
        if (!string.IsNullOrWhiteSpace(newPassword))
            user.PasswordHash = Helpers.PasswordHasher.HashPassword(newPassword);

        // Handle profile picture upload
        if (file != null && file.Length > 0)
        {
            // Save the file to wwwroot/profile-pictures/{userId}.jpg (ensure wwwroot exists)
            var uploadsDir = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "profile-pictures"
            );
            if (!Directory.Exists(uploadsDir))
                Directory.CreateDirectory(uploadsDir);
            var filePath = Path.Combine(uploadsDir, $"{user.Id}.jpg");
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            user.ProfilePictureUrl = $"/profile-pictures/{user.Id}.jpg";
        }

        await _context.SaveChangesAsync();
        return Ok(user);
    }
}
