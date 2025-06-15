using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PokeDexAPI.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class TestController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { message = "Secure data accessible only with valid JWT" });
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("admin")]
    public IActionResult AdminOnly()
    {
        var currentUserId = User.FindFirstValue("id");
        var currentUsername = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        return Ok(
            new
            {
                message = $"Hello user number {currentUserId}, {currentUsername} , Admin-only endpoint",
            }
        );
    }

    [Authorize(Roles = "User")]
    [HttpGet("user")]
    public IActionResult UserOnly()
    {
        var currentUserId = User.FindFirstValue("id");
        var currentUsername = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        return Ok(
            new { message = $"Hello {currentUserId}, {currentUsername}, User-only endpoint" }
        );
    }
}
