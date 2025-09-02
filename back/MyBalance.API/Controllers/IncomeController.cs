using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyBalance.Core.DTOs;
using MyBalance.Core.Entities;
using MyBalance.Core.Interfaces;
using System.Security.Claims;

namespace MyBalance.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class IncomeController : ControllerBase
{
    private readonly IIncomeRepository _incomeRepository;

    public IncomeController(IIncomeRepository incomeRepository)
    {
        _incomeRepository = incomeRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Income>>> GetIncomes()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var incomes = await _incomeRepository.GetByUserIdAsync(userId);
            return Ok(incomes);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Income>> GetIncome(int id)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var income = await _incomeRepository.GetByIdAsync(id);
            if (income == null || income.UserId != userId)
            {
                return NotFound(new { message = "Income not found" });
            }

            return Ok(income);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult<Income>> CreateIncome([FromBody] CreateIncomeDto createIncomeDto)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var income = new Income
            {
                Amount = createIncomeDto.Amount,
                Category = createIncomeDto.Category,
                Description = createIncomeDto.Description,
                Date = createIncomeDto.Date,
                IsRecurring = createIncomeDto.IsRecurring,
                RecurrencePattern = createIncomeDto.RecurrencePattern,
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _incomeRepository.AddAsync(income);
            return CreatedAtAction(nameof(GetIncome), new { id = income.Id }, income);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Income>> UpdateIncome(int id, [FromBody] UpdateIncomeDto updateIncomeDto)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var income = await _incomeRepository.GetByIdAsync(id);
            if (income == null || income.UserId != userId)
            {
                return NotFound(new { message = "Income not found" });
            }

            income.Amount = updateIncomeDto.Amount;
            income.Category = updateIncomeDto.Category;
            income.Description = updateIncomeDto.Description;
            income.Date = updateIncomeDto.Date;
            income.IsRecurring = updateIncomeDto.IsRecurring;
            income.RecurrencePattern = updateIncomeDto.RecurrencePattern;
            income.UpdatedAt = DateTime.UtcNow;

            await _incomeRepository.UpdateAsync(income);
            return Ok(income);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteIncome(int id)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var income = await _incomeRepository.GetByIdAsync(id);
            if (income == null || income.UserId != userId)
            {
                return NotFound(new { message = "Income not found" });
            }

            await _incomeRepository.DeleteAsync(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("date-range")]
    public async Task<ActionResult<IEnumerable<Income>>> GetIncomesByDateRange(
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            if (startDate > endDate)
            {
                return BadRequest(new { message = "Start date cannot be greater than end date" });
            }

            var incomes = await _incomeRepository.GetByUserIdAndDateRangeAsync(userId, startDate, endDate);
            return Ok(incomes);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
