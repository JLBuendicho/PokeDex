using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using PokeDexAPI.Data;
using PokeDexAPI.Services;

var builder = WebApplication.CreateBuilder(args);
string localIPAddress = GetLocalIPAddress();
Console.WriteLine($"Local IP Address: {localIPAddress}");

// Add services to the container.

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition(
        "Bearer",
        new OpenApiSecurityScheme
        {
            Description = "JWT Authorization header",
            Name = "Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer",
        }
    );

    c.AddSecurityRequirement(
        new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer",
                    },
                },
                Array.Empty<string>()
            },
        }
    );
});

builder.Services.AddControllers();
builder.Services.AddSingleton<TokenProvider>();

builder.Services.AddDbContext<PokeDexDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("PokeDexDatabase"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("PokeDexDatabase"))
    )
);

// Add JWT Authentication
var lanIp = GetLocalIPAddress();
var dynamicAudience = $"http://{lanIp}:5079";

builder
    .Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false; // Prevents double-mapping of 'sub' to NameIdentifier
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudiences = new[]
            {
                builder.Configuration["Jwt:Audience"],
                "http://localhost:5079",
                dynamicAudience,
            },
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
            ),
            NameClaimType = ClaimTypes.NameIdentifier,
            RoleClaimType = ClaimTypes.Role,
        };
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowReactApp",
        policy =>
            policy
                .WithOrigins($"http://{localIPAddress}:5173", "http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials()
    );
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowReactApp");

app.UseStaticFiles();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();

string GetLocalIPAddress()
{
    var host = System.Net.Dns.GetHostEntry(System.Net.Dns.GetHostName());
    foreach (var ip in host.AddressList)
    {
        if (
            ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork
            && !ip.ToString().StartsWith("127.")
        )
        {
            return ip.ToString(); // This is your LAN IPv4
        }
    }
    return "localhost"; // fallback
}
