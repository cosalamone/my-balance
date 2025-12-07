using System.Collections.Generic;

namespace MyBalance.Core.DTOs;

public class DashboardAggregatedDto
{
    public FinancialSummaryDto Summary { get; set; } = new FinancialSummaryDto();
    public IEnumerable<IncomeDto> Incomes { get; set; } = new List<IncomeDto>();
    public IEnumerable<ExpenseResponseDto> Expenses { get; set; } = new List<ExpenseResponseDto>();
    public IEnumerable<SavingsDto> Savings { get; set; } = new List<SavingsDto>();
    public UserDto? User { get; set; }
}
