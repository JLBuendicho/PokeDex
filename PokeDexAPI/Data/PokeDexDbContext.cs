using Microsoft.EntityFrameworkCore;
using PokeDexAPI.Models;

namespace PokeDexAPI.Data;

public class PokeDexDbContext : DbContext
{
    public PokeDexDbContext(DbContextOptions<PokeDexDbContext> options)
        : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Pokemon> Pokemons { get; set; }
}
