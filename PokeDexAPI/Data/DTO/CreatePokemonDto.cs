using System.ComponentModel.DataAnnotations;

namespace PokeDexAPI.Models;

public class CreatePokemonDto
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Range(1, 500)]
    public int HP { get; set; }

    [Range(1, 500)]
    public int Attack { get; set; }

    [Range(1, 500)]
    public int Defense { get; set; }

    public List<string> Types { get; set; } = new List<string> { "Normal" };

    public string Description { get; set; } = string.Empty;

    // Remove required attribute from ImageUrl
    public string ImageUrl { get; set; } = string.Empty;
}
