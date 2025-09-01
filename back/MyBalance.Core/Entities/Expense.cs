using System.ComponentModel.DataAnnotations;

namespace MyBalance.Core.Entities;

public enum ExpenseCategory
{
    Housing,
    Food,
    Transportation,
    Entertainment,
    Healthcare,
    Education,
    Shopping,
    Utilities,
    Other
}

public class Expense
{
    public int Id { get; set; }
    
    [Required]
    public decimal Amount { get; set; }
    
    [Required]
    public ExpenseCategory Category { get; set; }
    
    [Required]
    [StringLength(500)]
    public string Description { get; set; } = string.Empty;
    
    [Required]
    public DateTime Date { get; set; }
    
    public bool IsFixed { get; set; }
    public bool IsRecurring { get; set; }
    
    public string? RecurrencePattern { get; set; } // monthly, weekly, yearly
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Foreign key
    public int UserId { get; set; }
    public User User { get; set; } = null!;
}
