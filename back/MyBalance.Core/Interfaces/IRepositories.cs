using MyBalance.Core.Entities;

namespace MyBalance.Core.Interfaces;

public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(int id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<T> AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(int id);
}

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<bool> EmailExistsAsync(string email);
}

public interface IIncomeRepository : IRepository<Income>
{
    Task<IEnumerable<Income>> GetByUserIdAsync(int userId);
    Task<IEnumerable<Income>> GetByUserIdAndDateRangeAsync(int userId, DateTime startDate, DateTime endDate);
}

public interface IExpenseRepository : IRepository<Expense>
{
    Task<IEnumerable<Expense>> GetByUserIdAsync(int userId);
    Task<IEnumerable<Expense>> GetByUserIdAndDateRangeAsync(int userId, DateTime startDate, DateTime endDate);
}

public interface ISavingsRepository : IRepository<Savings>
{
    Task<IEnumerable<Savings>> GetByUserIdAsync(int userId);
    Task<IEnumerable<Savings>> GetByUserIdAndDateRangeAsync(int userId, DateTime startDate, DateTime endDate);
}
