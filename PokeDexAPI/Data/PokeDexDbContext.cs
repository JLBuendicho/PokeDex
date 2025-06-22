using Microsoft.EntityFrameworkCore;
using PokeDexAPI.Helpers;
using PokeDexAPI.Models;

namespace PokeDexAPI.Data;

public class PokeDexDbContext : DbContext
{
    public PokeDexDbContext(DbContextOptions<PokeDexDbContext> options)
        : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Pokemon> Pokemons { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var hashedPassword = PasswordHasher.HashPassword("Password123");
        modelBuilder
            .Entity<User>()
            .HasData(
                new User
                {
                    Id = 1,
                    Username = "admin",
                    PasswordHash = hashedPassword,
                    Email = "admin@mail.com",
                    Role = "Admin",
                    CreatedAt = new DateTime(0001, 1, 1),
                    UpdatedAt = new DateTime(0001, 1, 1),
                    ProfilePictureUrl = "/profile-pictures/1.png",
                },
                new User
                {
                    Id = 2,
                    Username = "Johnny",
                    PasswordHash = hashedPassword,
                    Email = "johnny@mail.com",
                    Role = "Admin",
                    CreatedAt = new DateTime(0001, 1, 1),
                    UpdatedAt = new DateTime(0001, 1, 1),
                    ProfilePictureUrl = "/profile-pictures/2.png",
                },
                new User
                {
                    Id = 3,
                    Username = "Lamuel",
                    PasswordHash = hashedPassword,
                    Email = "lamuel@mail.com",
                    Role = "Admin",
                    CreatedAt = new DateTime(0001, 1, 1),
                    UpdatedAt = new DateTime(0001, 1, 1),
                    ProfilePictureUrl = "/profile-pictures/3.png",
                },
                new User
                {
                    Id = 4,
                    Username = "peepeepoopoo",
                    PasswordHash = hashedPassword,
                    Email = "peepoo@mail.com",
                    Role = "Admin",
                    CreatedAt = new DateTime(0001, 1, 1),
                    UpdatedAt = new DateTime(0001, 1, 1),
                    ProfilePictureUrl = "/profile-default.svg",
                },
                new User
                {
                    Id = 5,
                    Username = "Peter Griffith",
                    PasswordHash = hashedPassword,
                    Email = "griffith@mail.com",
                    Role = "User",
                    CreatedAt = new DateTime(0001, 1, 1),
                    UpdatedAt = new DateTime(0001, 1, 1),
                    ProfilePictureUrl = "/profile-pictures/5.png",
                },
                new User
                {
                    Id = 6,
                    Username = "Guts N Glory",
                    PasswordHash = hashedPassword,
                    Email = "guts@mail.com",
                    Role = "User",
                    CreatedAt = new DateTime(0001, 1, 1),
                    UpdatedAt = new DateTime(0001, 1, 1),
                    ProfilePictureUrl = "/profile-pictures/6.png",
                }
            );
        modelBuilder
            .Entity<Pokemon>()
            .HasData(
                new Pokemon
                {
                    Id = 1,
                    Name = "Pikachu",
                    HP = 50,
                    Attack = 50,
                    Defense = 50,
                    Types = ["Electric"],
                    Description =
                        "When it is angered, it immediately discharges the energy stored in the pouches in its cheeks.",
                    ImageUrl = "/pokemon-images/Pikachu_20250623010509754.png",
                },
                new Pokemon
                {
                    Id = 2,
                    Name = "Charmander",
                    HP = 50,
                    Attack = 50,
                    Defense = 50,
                    Types = ["Fire"],
                    Description =
                        "The flame on its tail shows the strength of its life-force. If Charmander is weak, the flame also burns weakly.",
                    ImageUrl = "/pokemon-images/Charmander_20250623010537519.png",
                },
                new Pokemon
                {
                    Id = 3,
                    Name = "Bulbasaur",
                    HP = 50,
                    Attack = 50,
                    Defense = 50,
                    Types = ["Grass", "Poison"],
                    Description =
                        "For some time after its birth, it uses the nutrients that are packed into the seed on its back in order to grow.",
                    ImageUrl = "/pokemon-images/Bulbasaur_20250623010553851.png",
                },
                new Pokemon
                {
                    Id = 4,
                    Name = "Squirtle",
                    HP = 50,
                    Attack = 50,
                    Defense = 50,
                    Types = ["Water"],
                    Description =
                        "After birth, its back swells and hardens into a shell. It sprays a potent foam from its mouth.",
                    ImageUrl = "/pokemon-images/Squirtle_20250623033113036.png",
                }
            );
    }
}
