using MyBalance.Core.Entities;
using System.ComponentModel.DataAnnotations;

namespace MyBalance.Core.DTOs;

public class CreateSavingsDto
{
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "El monto debe ser mayor a 0")]
    public decimal Amount { get; set; }

    [Required]
    public SavingsCategory Category { get; set; }

    [Required]
    [StringLength(500, MinimumLength = 3, ErrorMessage = "La descripción debe tener entre 3 y 500 caracteres")]
    public string Description { get; set; } = string.Empty;

    [Required]
    public DateTime Date { get; set; }

    [Range(0.01, double.MaxValue, ErrorMessage = "El monto objetivo debe ser mayor a 0")]
    public decimal? GoalAmount { get; set; }

    public DateTime? TargetDate { get; set; }
}

public class UpdateSavingsDto
{
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "El monto debe ser mayor a 0")]
    public decimal Amount { get; set; }

    [Required]
    public SavingsCategory Category { get; set; }

    [Required]
    [StringLength(500, MinimumLength = 3, ErrorMessage = "La descripción debe tener entre 3 y 500 caracteres")]
    public string Description { get; set; } = string.Empty;

    [Required]
    public DateTime Date { get; set; }

    [Range(0.01, double.MaxValue, ErrorMessage = "El monto objetivo debe ser mayor a 0")]
    public decimal? GoalAmount { get; set; }

    public DateTime? TargetDate { get; set; }
}

public class SavingsDto
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public SavingsCategory Category { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public decimal? GoalAmount { get; set; }
    public DateTime? TargetDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
