using System.ComponentModel.DataAnnotations;
using MyBalance.Core.Entities;

namespace MyBalance.Core.DTOs;

public class CreateExpenseDto
{
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "El monto debe ser mayor a 0")]
    public decimal Amount { get; set; }

    [Required]
    public ExpenseCategory Category { get; set; }

    [Required]
    [StringLength(500, MinimumLength = 3, ErrorMessage = "La descripción debe tener entre 3 y 500 caracteres")]
    public string Description { get; set; } = string.Empty;

    [Required]
    public DateTime Date { get; set; }

    public bool IsFixed { get; set; }

    public bool IsRecurring { get; set; }

    public string? RecurrencePattern { get; set; }
}

public class UpdateExpenseDto
{
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "El monto debe ser mayor a 0")]
    public decimal Amount { get; set; }

    [Required]
    public ExpenseCategory Category { get; set; }

    [Required]
    [StringLength(500, MinimumLength = 3, ErrorMessage = "La descripción debe tener entre 3 y 500 caracteres")]
    public string Description { get; set; } = string.Empty;

    [Required]
    public DateTime Date { get; set; }

    public bool IsFixed { get; set; }

    public bool IsRecurring { get; set; }

    public string? RecurrencePattern { get; set; }
}

public class ExpenseResponseDto
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public ExpenseCategory Category { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public bool IsFixed { get; set; }
    public bool IsRecurring { get; set; }
    public string? RecurrencePattern { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
