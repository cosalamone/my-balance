using MyBalance.Core.Entities;
using System.ComponentModel.DataAnnotations;

namespace MyBalance.Core.DTOs;

public class CreateIncomeDto
{
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "El monto debe ser mayor a 0")]
    public decimal Amount { get; set; }
    
    [Required]
    public IncomeCategory Category { get; set; }
    
    [Required]
    [StringLength(500, MinimumLength = 3, ErrorMessage = "La descripción debe tener entre 3 y 500 caracteres")]
    public string Description { get; set; } = string.Empty;
    
    [Required]
    public DateTime Date { get; set; }
    
    public bool IsRecurring { get; set; }
    
    public string? RecurrencePattern { get; set; }
}

public class UpdateIncomeDto
{
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "El monto debe ser mayor a 0")]
    public decimal Amount { get; set; }
    
    [Required]
    public IncomeCategory Category { get; set; }
    
    [Required]
    [StringLength(500, MinimumLength = 3, ErrorMessage = "La descripción debe tener entre 3 y 500 caracteres")]
    public string Description { get; set; } = string.Empty;
    
    [Required]
    public DateTime Date { get; set; }
    
    public bool IsRecurring { get; set; }
    
    public string? RecurrencePattern { get; set; }
}

public class IncomeDto
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public IncomeCategory Category { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public bool IsRecurring { get; set; }
    public string? RecurrencePattern { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
