using System.ComponentModel.DataAnnotations;

namespace PokeDexAPI.Models;

public class Pokemon
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public int HP { get; set; }

    public int Attack { get; set; }

    public int Defense { get; set; }

    public List<string> Types { get; set; } = new List<string> { "Normal" };

    public string Description { get; set; } = string.Empty;

    public string ImageUrl { get; set; } = string.Empty;
}
