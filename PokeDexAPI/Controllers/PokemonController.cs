using System;
using System.IO;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PokeDexAPI.Data;
using PokeDexAPI.Models;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace PokeDexAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PokemonsController : ControllerBase
{
    private const string DefaultImageUrl = "/profile-default.svg";
    private readonly PokeDexDbContext _context;

    public PokemonsController(PokeDexDbContext context)
    {
        _context = context;
    }

    // GET: api/pokemons
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Pokemon>>> GetPokemons()
    {
        return await _context.Pokemons.ToListAsync();
    }

    // GET: api/pokemons/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Pokemon>> GetPokemonById(int id)
    {
        var pokemon = await _context.Pokemons.FindAsync(id);

        if (pokemon == null)
        {
            return NotFound();
        }

        return pokemon;
    }

    // POST: api/pokemons/register
    [Authorize(Roles = "Admin")]
    [HttpPost("register")]
    public async Task<ActionResult<Pokemon>> RegisterPokemon()
    {
        var form = await Request.ReadFormAsync();

        // Validate required fields
        if (
            !form.ContainsKey("Name")
            || !form.ContainsKey("HP")
            || !form.ContainsKey("Attack")
            || !form.ContainsKey("Defense")
            || !form.ContainsKey("Description")
        )
        {
            return BadRequest("Missing required fields");
        }

        string name = form["Name"].ToString();

        // Check for existing Pokémon
        if (await _context.Pokemons.AnyAsync(p => p.Name.ToLower() == name.ToLower()))
        {
            return Conflict($"A Pokémon named '{name}' already exists.");
        }

        int hp = int.TryParse(form["HP"], out var h) ? h : 0;
        int attack = int.TryParse(form["Attack"], out var a) ? a : 0;
        int defense = int.TryParse(form["Defense"], out var d) ? d : 0;
        string description = form["Description"].ToString();

        // Handle types
        var types = new List<string>();
        if (form.ContainsKey("Types"))
        {
            foreach (var typeValue in form["Types"])
            {
                if (!string.IsNullOrWhiteSpace(typeValue))
                {
                    types.Add(typeValue);
                }
            }
        }
        if (types.Count == 0)
            types.Add("Normal");

        // Handle image
        string imageUrl = DefaultImageUrl;
        var imageFile = form.Files["Image"];
        if (imageFile != null && imageFile.Length > 0)
        {
            var fileName = GenerateUniqueFileName(name, imageFile.FileName);
            imageUrl = await SaveImageFile(imageFile, fileName);
        }

        // Create Pokémon
        var pokemon = new Pokemon
        {
            Name = name,
            HP = hp,
            Attack = attack,
            Defense = defense,
            Types = types,
            Description = description,
            ImageUrl = imageUrl,
        };

        _context.Pokemons.Add(pokemon);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPokemonById), new { id = pokemon.Id }, pokemon);
    }

    // PUT: api/pokemons/5
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePokemon(int id)
    {
        var pokemon = await _context.Pokemons.FindAsync(id);
        if (pokemon == null)
        {
            return NotFound(new { message = $"Pokemon with ID {id} not found." });
        }

        var form = await Request.ReadFormAsync();
        string oldName = pokemon.Name;
        string oldImageUrl = pokemon.ImageUrl;

        // Handle name change
        if (form.ContainsKey("Name"))
        {
            string newName = form["Name"].ToString();

            if (!string.Equals(oldName, newName, StringComparison.OrdinalIgnoreCase))
            {
                if (
                    await _context.Pokemons.AnyAsync(p =>
                        p.Id != id && p.Name.ToLower() == newName.ToLower()
                    )
                )
                {
                    return Conflict($"A Pokémon named '{newName}' already exists.");
                }
                pokemon.Name = newName;
            }
        }

        // Update stats
        if (form.ContainsKey("HP") && int.TryParse(form["HP"], out int hp))
            pokemon.HP = hp;
        if (form.ContainsKey("Attack") && int.TryParse(form["Attack"], out int attack))
            pokemon.Attack = attack;
        if (form.ContainsKey("Defense") && int.TryParse(form["Defense"], out int defense))
            pokemon.Defense = defense;
        if (form.ContainsKey("Description"))
            pokemon.Description = form["Description"].ToString();

        // Fixed types handling
        if (form.ContainsKey("Types"))
        {
            pokemon.Types = form["Types"]
                .Where(t => !string.IsNullOrWhiteSpace(t))
                .Select(t => t!)
                .ToList();

            if (pokemon.Types.Count == 0)
                pokemon.Types.Add("Normal");
        }

        // Image handling remains unchanged
        var imageFile = form.Files["Image"];
        if (imageFile != null && imageFile.Length > 0)
        {
            var fileName = GenerateUniqueFileName(pokemon.Name, imageFile.FileName);
            pokemon.ImageUrl = await SaveImageFile(imageFile, fileName);
        }

        try
        {
            await _context.SaveChangesAsync();

            if (
                !string.IsNullOrEmpty(oldImageUrl)
                && oldImageUrl != DefaultImageUrl
                && oldImageUrl != pokemon.ImageUrl
            )
            {
                DeleteImageFile(oldImageUrl);
            }
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!PokemonExists(id))
                return NotFound();
            throw;
        }

        return Ok(pokemon);
    }

    // DELETE: api/pokemons/5
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePokemon(int id)
    {
        var pokemon = await _context.Pokemons.FindAsync(id);
        if (pokemon == null)
        {
            return NotFound(new { message = $"Pokemon with ID {id} not found." });
        }

        string imageUrl = pokemon.ImageUrl;

        _context.Pokemons.Remove(pokemon);
        await _context.SaveChangesAsync();

        // Delete image after successful DB removal
        if (!string.IsNullOrEmpty(imageUrl) && imageUrl != DefaultImageUrl)
        {
            DeleteImageFile(imageUrl);
        }

        return NoContent();
    }

    private bool PokemonExists(int id)
    {
        return _context.Pokemons.Any(e => e.Id == id);
    }

    private string GenerateUniqueFileName(string pokemonName, string originalFileName)
    {
        string sanitized = SanitizeFileName(pokemonName);
        string extension = Path.GetExtension(originalFileName);

        if (
            string.IsNullOrEmpty(extension)
            || !extension.Equals(".png", StringComparison.OrdinalIgnoreCase)
        )
        {
            extension = ".png";
        }

        return $"{sanitized}_{DateTime.Now:yyyyMMddHHmmssfff}{extension}";
    }

    private async Task<string> SaveImageFile(IFormFile imageFile, string fileName)
    {
        var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "pokemon-images");

        Directory.CreateDirectory(uploadsDir); // Safe if exists
        var filePath = Path.Combine(uploadsDir, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            // Convert to PNG format
            using (var image = await Image.LoadAsync(imageFile.OpenReadStream()))
            {
                await image.SaveAsPngAsync(stream);
            }
        }

        return $"/pokemon-images/{fileName}";
    }

    private void DeleteImageFile(string imageUrl)
    {
        // Extract filename from URL
        var fileName = Path.GetFileName(imageUrl);
        if (string.IsNullOrEmpty(fileName))
            return;

        var filePath = Path.Combine(
            Directory.GetCurrentDirectory(),
            "wwwroot",
            "pokemon-images",
            fileName
        );

        if (System.IO.File.Exists(filePath))
        {
            try
            {
                System.IO.File.Delete(filePath);
            }
            catch
            {
                // Log deletion error if needed
            }
        }
    }

    private static string SanitizeFileName(string name)
    {
        var invalidChars = Path.GetInvalidFileNameChars();
        return new string(name.Where(ch => !invalidChars.Contains(ch)).ToArray()).Replace(" ", "_");
    }
}
