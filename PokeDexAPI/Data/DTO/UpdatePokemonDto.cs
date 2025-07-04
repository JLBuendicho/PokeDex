using System.ComponentModel.DataAnnotations;

namespace PokeDexAPI.Models;

public class UpdatePokemonDto
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

    public string ImageUrl { get; set; } = string.Empty;
}
