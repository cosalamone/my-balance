using MyBalance.Core.DTOs;
using MyBalance.Core.Interfaces;

namespace MyBalance.Application.Services;

public class FinancialService : IFinancialService
{
    private readonly IIncomeRepository _incomeRepository;
    private readonly IExpenseRepository _expenseRepository;
    private readonly ISavingsRepository _savingsRepository;

    public FinancialService(
        IIncomeRepository incomeRepository,
        IExpenseRepository expenseRepository,
        ISavingsRepository savingsRepository)
    {
        _incomeRepository = incomeRepository;
        _expenseRepository = expenseRepository;
        _savingsRepository = savingsRepository;
    }

    public async Task<FinancialSummaryDto> GetFinancialSummaryAsync(int userId)
    {
        var currentMonth = DateTime.UtcNow.Date.AddDays(1 - DateTime.UtcNow.Day);
        var nextMonth = currentMonth.AddMonths(1);
        var previousMonth = currentMonth.AddMonths(-1);

        return await GetFinancialSummaryByDateRangeAsync(userId, previousMonth, nextMonth);
    }

    public async Task<FinancialSummaryDto> GetFinancialSummaryByDateRangeAsync(int userId, DateTime startDate, DateTime endDate)
    {
        // Get all transactions for the user in the date range
        var incomes = await _incomeRepository.GetByUserIdAndDateRangeAsync(userId, startDate, endDate);
        var expenses = await _expenseRepository.GetByUserIdAndDateRangeAsync(userId, startDate, endDate);
        var savings = await _savingsRepository.GetByUserIdAndDateRangeAsync(userId, startDate, endDate);

        // Calculate current month (this month)
        var currentMonthStart = DateTime.UtcNow.Date.AddDays(1 - DateTime.UtcNow.Day);
        var currentMonthEnd = currentMonthStart.AddMonths(1);

        var currentMonthIncomes = incomes.Where(i => i.Date >= currentMonthStart && i.Date < currentMonthEnd);
        var currentMonthExpenses = expenses.Where(e => e.Date >= currentMonthStart && e.Date < currentMonthEnd);
        var currentMonthSavings = savings.Where(s => s.Date >= currentMonthStart && s.Date < currentMonthEnd);

        // Calculate previous month
        var previousMonthStart = currentMonthStart.AddMonths(-1);
        var previousMonthEnd = currentMonthStart;

        var previousMonthIncomes = incomes.Where(i => i.Date >= previousMonthStart && i.Date < previousMonthEnd);
        var previousMonthExpenses = expenses.Where(e => e.Date >= previousMonthStart && e.Date < previousMonthEnd);
        var previousMonthSavings = savings.Where(s => s.Date >= previousMonthStart && s.Date < previousMonthEnd);

        // Calculate totals
        var totalIncome = incomes.Sum(i => i.Amount);
        var totalExpenses = expenses.Sum(e => e.Amount);
        var totalSavings = savings.Sum(s => s.Amount);

        var currentMonthData = new MonthlyDataDto
        {
            Income = currentMonthIncomes.Sum(i => i.Amount),
            Expenses = currentMonthExpenses.Sum(e => e.Amount),
            Savings = currentMonthSavings.Sum(s => s.Amount)
        };

        var previousMonthData = new MonthlyDataDto
        {
            Income = previousMonthIncomes.Sum(i => i.Amount),
            Expenses = previousMonthExpenses.Sum(e => e.Amount),
            Savings = previousMonthSavings.Sum(s => s.Amount)
        };

        return new FinancialSummaryDto
        {
            TotalIncome = totalIncome,
            TotalExpenses = totalExpenses,
            TotalSavings = totalSavings,
            Balance = totalIncome - totalExpenses,
            CurrentMonth = currentMonthData,
            PreviousMonth = previousMonthData
        };
    }

    public async Task<DashboardAggregatedDto> GetDashboardAggregatedAsync(int userId, int itemsLimit = 20)
    {
        // Parallelize common reads to reduce latency
        var incomesTask = _incomeRepository.GetByUserIdAsync(userId);
        var expensesTask = _expenseRepository.GetByUserIdAsync(userId);
        var savingsTask = _savingsRepository.GetByUserIdAsync(userId);
        var summaryTask = GetFinancialSummaryAsync(userId);

        await Task.WhenAll(incomesTask, expensesTask, savingsTask, summaryTask);

        var incomes = incomesTask.Result.OrderByDescending(i => i.Date).Take(itemsLimit)
            .Select(i => new IncomeDto {
                Id = i.Id,
                Amount = i.Amount,
                Category = i.Category,
                Description = i.Description,
                Date = i.Date,
                IsRecurring = i.IsRecurring,
                RecurrencePattern = i.RecurrencePattern,
                CreatedAt = i.CreatedAt,
                UpdatedAt = i.UpdatedAt
            }).ToList();

        var expenses = expensesTask.Result.OrderByDescending(e => e.Date).Take(itemsLimit)
            .Select(e => new ExpenseResponseDto {
                Id = e.Id,
                Amount = e.Amount,
                Category = e.Category,
                Description = e.Description,
                Date = e.Date,
                IsRecurring = e.IsRecurring,
                RecurrencePattern = e.RecurrencePattern,
                CreatedAt = e.CreatedAt,
                UpdatedAt = e.UpdatedAt
            }).ToList();

        var savings = savingsTask.Result.OrderByDescending(s => s.Date).Take(itemsLimit)
            .Select(s => new SavingsDto {
                Id = s.Id,
                Amount = s.Amount,
                Category = s.Category,
                Description = s.Description,
                Date = s.Date,
                GoalAmount = s.GoalAmount,
                TargetDate = s.TargetDate,
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt
            }).ToList();

        return new DashboardAggregatedDto
        {
            Summary = summaryTask.Result,
            Incomes = incomes,
            Expenses = expenses,
            Savings = savings
        };
    }
}
