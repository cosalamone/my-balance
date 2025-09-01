namespace MyBalance.Core.DTOs;

public class FinancialSummaryDto
{
    public decimal TotalIncome { get; set; }
    public decimal TotalExpenses { get; set; }
    public decimal TotalSavings { get; set; }
    public decimal Balance { get; set; }
    public MonthlyDataDto CurrentMonth { get; set; } = new();
    public MonthlyDataDto PreviousMonth { get; set; } = new();
}

public class MonthlyDataDto
{
    public decimal Income { get; set; }
    public decimal Expenses { get; set; }
    public decimal Savings { get; set; }
}
