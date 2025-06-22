using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PokeDexAPI.Data;
using PokeDexAPI.Models;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

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

    [Authorize]
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
        {
            // Check if new username is already taken
            var usernameExists = await _context.Users.AnyAsync(u =>
                u.Username == username && u.Id != user.Id
            );

            if (usernameExists)
            {
                return Conflict(new { message = "Username is already taken." });
            }
            user.Username = username;
        }

        // Update password if provided
        if (!string.IsNullOrWhiteSpace(newPassword))
            user.PasswordHash = Helpers.PasswordHasher.HashPassword(newPassword);

        // Handle profile picture upload
        if (file != null && file.Length > 0)
        {
            var uploadsDir = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "profile-pictures"
            );
            if (!Directory.Exists(uploadsDir))
                Directory.CreateDirectory(uploadsDir);

            // Use PNG extension
            var filePath = Path.Combine(uploadsDir, $"{user.Id}.png");
            Console.WriteLine(
                $"Attempting to save profile picture to: {filePath}, Length: {file.Length}"
            );
            try
            {
                // Convert to PNG using ImageSharp
                using (var image = await Image.LoadAsync(file.OpenReadStream()))
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.SaveAsPngAsync(stream);
                }

                Console.WriteLine($"Profile picture saved successfully at: {filePath}");
                user.ProfilePictureUrl = $"/profile-pictures/{user.Id}.png"; // Update to .png
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving profile picture: {ex.Message}");
                return StatusCode(500, new { message = "Error saving profile picture." });
            }
        }

        await _context.SaveChangesAsync();
        return Ok(user);
    }

    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound();

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userRoleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
        bool isAdmin = userRoleClaim == "admin" || userRoleClaim == "Admin";
        bool isSelf = user.Id.ToString() == userIdClaim;
        if (!isSelf && !isAdmin)
            return Forbid();

        var defaultProfilePic = "/profile-default.svg";
        if (
            !string.IsNullOrEmpty(user.ProfilePictureUrl)
            && user.ProfilePictureUrl != defaultProfilePic
        )
        {
            var filePath = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "profile-pictures",
                $"{user.Id}.jpg"
            );
            if (System.IO.File.Exists(filePath))
            {
                try
                {
                    System.IO.File.Delete(filePath);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error deleting profile picture: {ex.Message}");
                }
            }
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
