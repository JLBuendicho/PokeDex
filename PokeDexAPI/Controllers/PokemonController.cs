using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PokeDexAPI.Data;
using PokeDexAPI.Models;

namespace PokeDexAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PokemonsController : ControllerBase
{
    private readonly PokeDexDbContext _context;

    public PokemonsController(PokeDexDbContext context)
    {
        _context = context;
    }

    // GET: api/Pokemons
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Pokemon>>> GetPokemons()
    {
        return await _context.Pokemons.ToListAsync();
    }

    // GET: api/Pokemons/5
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

    // POST: api/Pokemons
    [HttpPost]
    public async Task<ActionResult<Pokemon>> PostPokemon(CreatePokemonDto createPokemonDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var pokemon = new Pokemon
        {
            Name = createPokemonDto.Name,
            HP = createPokemonDto.HP,
            Attack = createPokemonDto.Attack,
            Defense = createPokemonDto.Defense,
            Types = createPokemonDto.Types,
            Description = createPokemonDto.Description,
            ImageUrl = createPokemonDto.ImageUrl,
        };

        _context.Pokemons.Add(pokemon);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPokemonById), new { id = pokemon.Id }, pokemon);
    }

    // PUT: api/Pokemons/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePokemon(
        int id,
        [FromBody] UpdatePokemonDto updatePokemonDto
    )
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var existingPokemon = await _context.Pokemons.FindAsync(id);

        if (existingPokemon == null)
        {
            return NotFound(new { message = $"Pokemon with ID {id} not found." });
        }

        existingPokemon.Name = updatePokemonDto.Name;
        existingPokemon.HP = updatePokemonDto.HP;
        existingPokemon.Attack = updatePokemonDto.Attack;
        existingPokemon.Defense = updatePokemonDto.Defense;
        existingPokemon.Types = updatePokemonDto.Types;
        existingPokemon.Description = updatePokemonDto.Description;
        existingPokemon.ImageUrl = updatePokemonDto.ImageUrl;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/Pokemons/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePokemon(int id)
    {
        var pokemon = await _context.Pokemons.FindAsync(id);
        if (pokemon == null)
        {
            return NotFound();
        }

        _context.Pokemons.Remove(pokemon);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
