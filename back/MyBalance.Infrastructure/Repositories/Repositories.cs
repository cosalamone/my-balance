using Microsoft.EntityFrameworkCore;
using MyBalance.Core.Entities;
using MyBalance.Core.Interfaces;
using MyBalance.Infrastructure.Data;

namespace MyBalance.Infrastructure.Repositories;

public class Repository<T> : IRepository<T> where T : class
{
    protected readonly AppDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public Repository(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public virtual async Task<T?> GetByIdAsync(int id)
    {
        return await _dbSet.FindAsync(id);
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public virtual async Task<T> AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public virtual async Task UpdateAsync(T entity)
    {
        _dbSet.Update(entity);
        await _context.SaveChangesAsync();
    }

    public virtual async Task DeleteAsync(int id)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            _dbSet.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        return await _dbSet.AnyAsync(u => u.Email == email);
    }
}

public class IncomeRepository : Repository<Income>, IIncomeRepository
{
    public IncomeRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Income>> GetByUserIdAsync(int userId)
    {
        return await _dbSet
            .Where(i => i.UserId == userId)
            .OrderByDescending(i => i.Date)
            .ToListAsync();
    }

    public async Task<IEnumerable<Income>> GetByUserIdAndDateRangeAsync(int userId, DateTime startDate, DateTime endDate)
    {
        return await _dbSet
            .Where(i => i.UserId == userId && i.Date >= startDate && i.Date < endDate)
            .OrderByDescending(i => i.Date)
            .ToListAsync();
    }
}

public class ExpenseRepository : Repository<Expense>, IExpenseRepository
{
    public ExpenseRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Expense>> GetByUserIdAsync(int userId)
    {
        return await _dbSet
            .Where(e => e.UserId == userId)
            .OrderByDescending(e => e.Date)
            .ToListAsync();
    }

    public async Task<IEnumerable<Expense>> GetByUserIdAndDateRangeAsync(int userId, DateTime startDate, DateTime endDate)
    {
        return await _dbSet
            .Where(e => e.UserId == userId && e.Date >= startDate && e.Date < endDate)
            .OrderByDescending(e => e.Date)
            .ToListAsync();
    }
}

public class SavingsRepository : Repository<Savings>, ISavingsRepository
{
    public SavingsRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Savings>> GetByUserIdAsync(int userId)
    {
        return await _dbSet
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.Date)
            .ToListAsync();
    }

    public async Task<IEnumerable<Savings>> GetByUserIdAndDateRangeAsync(int userId, DateTime startDate, DateTime endDate)
    {
        return await _dbSet
            .Where(s => s.UserId == userId && s.Date >= startDate && s.Date < endDate)
            .OrderByDescending(s => s.Date)
            .ToListAsync();
    }
}
