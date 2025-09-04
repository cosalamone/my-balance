using Microsoft.EntityFrameworkCore;
using MyBalance.Core.Entities;

namespace MyBalance.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Income> Incomes { get; set; }
    public DbSet<Expense> Expenses { get; set; }
    public DbSet<Savings> Savings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PasswordHash).IsRequired();
        });

        // Income configuration
        modelBuilder.Entity<Income>(entity =>
        {
            entity.HasKey(e => e.Id);
            // SQLite doesn't support decimal precision, using column type
            entity.Property(e => e.Amount).HasColumnType("DECIMAL(18,2)");
            entity.Property(e => e.Description).IsRequired().HasMaxLength(500);
            entity.HasOne(e => e.User)
                  .WithMany(u => u.Incomes)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Expense configuration
        modelBuilder.Entity<Expense>(entity =>
        {
            entity.HasKey(e => e.Id);
            // SQLite doesn't support decimal precision, using column type
            entity.Property(e => e.Amount).HasColumnType("DECIMAL(18,2)");
            entity.Property(e => e.Description).IsRequired().HasMaxLength(500);
            entity.HasOne(e => e.User)
                  .WithMany(u => u.Expenses)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Savings configuration
        modelBuilder.Entity<Savings>(entity =>
        {
            entity.HasKey(e => e.Id);
            // SQLite doesn't support decimal precision, using column type
            entity.Property(e => e.Amount).HasColumnType("DECIMAL(18,2)");
            entity.Property(e => e.GoalAmount).HasColumnType("DECIMAL(18,2)");
            entity.Property(e => e.Description).IsRequired().HasMaxLength(500);
            entity.HasOne(e => e.User)
                  .WithMany(u => u.Savings)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
