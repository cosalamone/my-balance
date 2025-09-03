using System.ComponentModel.DataAnnotations;

namespace MyBalance.Core.Entities;

public enum ExpenseCategory
{
    Housing = 0,
    Food = 1,
    Transportation = 2,
    Entertainment = 3,
    Healthcare = 4,
    Education = 5,
    Shopping = 6,
    Utilities = 7,
    Other = 8
}

public enum ExpenseType
{
    Fixed = 0,
    Variable = 1
}

public class Expense
{
    public int Id { get; set; }

    [Required]
    public decimal Amount { get; set; }

    [Required]
    public ExpenseCategory Category { get; set; }

    public ExpenseType Type { get; set; } = ExpenseType.Variable;

    [Required]
    [StringLength(500)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public DateTime Date { get; set; }

    public bool IsFixed { get; set; }
    public bool IsRecurring { get; set; }

    public string? RecurrencePattern { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Foreign key
    public int UserId { get; set; }
    public User? User { get; set; }
}
