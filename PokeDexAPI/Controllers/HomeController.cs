using Microsoft.AspNetCore.Mvc;

namespace PokeDexAPI.Controllers;

[ApiController]
[Route("/")]
public class HomeController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok("Welcome to the PokeDex API!");
    }
}
