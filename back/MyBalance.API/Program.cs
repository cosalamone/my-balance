using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MyBalance.Application.Services;
using MyBalance.Core.Interfaces;
using MyBalance.Infrastructure.Data;
using MyBalance.Infrastructure.Repositories;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "MyBalance API", Version = "v1" });

    // Add JWT authentication to Swagger
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Database configuration - selectable provider (SQLite by default, MySql optional)
var dbProvider = builder.Configuration["DatabaseProvider"] ?? "Sqlite";
var defaultConn = builder.Configuration.GetConnectionString("DefaultConnection");

if (dbProvider.Equals("MySql", StringComparison.OrdinalIgnoreCase))
{
    // Requires Pomelo.EntityFrameworkCore.MySql (or another MySQL provider)
    // Install with: dotnet add package Pomelo.EntityFrameworkCore.MySql
    // Use ServerVersion.Parse to specify MySQL version (avoids AutoDetect)
    var serverVersion = ServerVersion.Parse("8.0.32-mysql");
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseMySql(defaultConn, serverVersion));
}
else
{
    // Fallback to SQLite
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlite(defaultConn));
}

// JWT Configuration
var jwtSecret = builder.Configuration["Jwt:Secret"] ?? "MyBalanceSecretKey2024!@#$%^&*()";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSecret)),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero
        };
    });

// Register repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IIncomeRepository, IncomeRepository>();
builder.Services.AddScoped<IExpenseRepository, ExpenseRepository>();
builder.Services.AddScoped<ISavingsRepository, SavingsRepository>();

// Register services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IFinancialService, FinancialService>();

// CORS configuration
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()
    ?? new[] { "http://localhost:4200", "http://localhost:4201" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", corsBuilder =>
    {
        corsBuilder.WithOrigins(allowedOrigins)
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAngularApp");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Database initialization - Apply migrations if available, otherwise continue
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        // Try to apply pending migrations
        context.Database.Migrate();
    }
    catch (Exception ex)
    {
        // If migration fails (e.g., table already exists), continue anyway
        // This allows the app to run even if tables were created outside of migrations
        Console.WriteLine($"Note: Migration application skipped: {ex.Message}");
    }

    // Seed demo user if not exists
    if (!context.Users.Any(u => u.Email == "demo@example.com"))
    {
        try
        {
            // Create demo user with proper password hashing using same method as AuthService
            using var rng = System.Security.Cryptography.RandomNumberGenerator.Create();
            var salt = new byte[16];
            rng.GetBytes(salt);

            using var pbkdf2 = new System.Security.Cryptography.Rfc2898DeriveBytes("demo123", salt, 10000, System.Security.Cryptography.HashAlgorithmName.SHA256);
            var hash = pbkdf2.GetBytes(32);

            var hashBytes = new byte[48];
            Array.Copy(salt, 0, hashBytes, 0, 16);
            Array.Copy(hash, 0, hashBytes, 16, 32);

            var demoUser = new MyBalance.Core.Entities.User
            {
                Email = "demo@example.com",
                FirstName = "Demo",
                LastName = "User",
                PasswordHash = Convert.ToBase64String(hashBytes),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsActive = true
            };

            context.Users.Add(demoUser);
            context.SaveChanges();

            Console.WriteLine("Demo user created successfully!");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Note: Demo user already exists or error: {ex.Message}");
        }
    }
}

app.Run();
