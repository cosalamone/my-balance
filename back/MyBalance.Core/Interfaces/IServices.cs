using MyBalance.Core.DTOs;

namespace MyBalance.Core.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto> LoginAsync(LoginRequestDto request);
    Task<LoginResponseDto> RegisterAsync(RegisterRequestDto request);
    Task<bool> ValidateTokenAsync(string token);
    Task<UserDto?> GetCurrentUserAsync(int userId);
}

public interface IFinancialService
{
    Task<FinancialSummaryDto> GetFinancialSummaryAsync(int userId);
    Task<FinancialSummaryDto> GetFinancialSummaryByDateRangeAsync(int userId, DateTime startDate, DateTime endDate);
}
