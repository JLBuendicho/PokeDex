using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace PokeDexAPI.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Pokemons",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    HP = table.Column<int>(type: "int", nullable: false),
                    Attack = table.Column<int>(type: "int", nullable: false),
                    Defense = table.Column<int>(type: "int", nullable: false),
                    Types = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ImageUrl = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pokemons", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Username = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PasswordHash = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Role = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ProfilePictureUrl = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Pokemons",
                columns: new[] { "Id", "Attack", "Defense", "Description", "HP", "ImageUrl", "Name", "Types" },
                values: new object[,]
                {
                    { 1, 50, 50, "When it is angered, it immediately discharges the energy stored in the pouches in its cheeks.", 50, "/pokemon-images/Pikachu_20250623010509754.png", "Pikachu", "[\"Electric\"]" },
                    { 2, 50, 50, "The flame on its tail shows the strength of its life-force. If Charmander is weak, the flame also burns weakly.", 50, "/pokemon-images/Charmander_20250623010537519.png", "Charmander", "[\"Fire\"]" },
                    { 3, 50, 50, "For some time after its birth, it uses the nutrients that are packed into the seed on its back in order to grow.", 50, "/pokemon-images/Bulbasaur_20250623010553851.png", "Bulbasaur", "[\"Grass\",\"Poison\"]" },
                    { 4, 50, 50, "After birth, its back swells and hardens into a shell. It sprays a potent foam from its mouth.", 50, "/pokemon-images/Squirtle_20250623033113036.png", "Squirtle", "[\"Water\"]" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "PasswordHash", "ProfilePictureUrl", "Role", "UpdatedAt", "Username" },
                values: new object[,]
                {
                    { 1, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "admin@mail.com", "$2a$12$CmuA1Wq06pIw9qmkHyfav.DnPaE0.qSFVXh3DwCkF2mZi8H6TJmUu", "/profile-pictures/1.png", "Admin", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "admin" },
                    { 2, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "johnny@mail.com", "$2a$12$CmuA1Wq06pIw9qmkHyfav.DnPaE0.qSFVXh3DwCkF2mZi8H6TJmUu", "/profile-pictures/2.png", "Admin", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Johnny" },
                    { 3, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "lamuel@mail.com", "$2a$12$CmuA1Wq06pIw9qmkHyfav.DnPaE0.qSFVXh3DwCkF2mZi8H6TJmUu", "/profile-pictures/3.png", "Admin", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Lamuel" },
                    { 4, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "peepoo@mail.com", "$2a$12$CmuA1Wq06pIw9qmkHyfav.DnPaE0.qSFVXh3DwCkF2mZi8H6TJmUu", "/profile-default.svg", "Admin", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "peepeepoopoo" },
                    { 5, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "griffith@mail.com", "$2a$12$CmuA1Wq06pIw9qmkHyfav.DnPaE0.qSFVXh3DwCkF2mZi8H6TJmUu", "/profile-pictures/5.png", "User", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Peter Griffith" },
                    { 6, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "guts@mail.com", "$2a$12$CmuA1Wq06pIw9qmkHyfav.DnPaE0.qSFVXh3DwCkF2mZi8H6TJmUu", "/profile-pictures/6.png", "User", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Guts N Glory" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Pokemons");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
