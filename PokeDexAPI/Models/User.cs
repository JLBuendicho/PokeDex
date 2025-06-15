using PokeDexAPI.Data.DTO;

namespace PokeDexAPI.Models;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = "User"; // Default role is User
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // factory method to create a new user from DTO
    public static User FromCreateUserDto(CreateUserDto dto, string hashedPassword)
    {
        return new User
        {
            Username = dto.Username,
            PasswordHash = hashedPassword,
            Email = dto.Email,
            Role = dto.Role,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
    }
}
