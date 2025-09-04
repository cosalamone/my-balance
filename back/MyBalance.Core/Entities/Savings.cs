using System.ComponentModel.DataAnnotations;

namespace MyBalance.Core.Entities;

public enum SavingsCategory
{
    EmergencyFund,
    Vacation,
    Retirement,
    Investment,
    Goal,
    Other
}

public class Savings
{
    public int Id { get; set; }
    
    [Required]
    public decimal Amount { get; set; }
    
    [Required]
    public SavingsCategory Category { get; set; }
    
    [Required]
    [StringLength(500)]
    public string Description { get; set; } = string.Empty;
    
    [Required]
    public DateTime Date { get; set; }
    
    public decimal? GoalAmount { get; set; }
    public DateTime? TargetDate { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Foreign key
    public int UserId { get; set; }
    public User User { get; set; } = null!;
}
