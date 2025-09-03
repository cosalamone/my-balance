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
public class SavingsController : ControllerBase
{
    private readonly ISavingsRepository _savingsRepository;

    public SavingsController(ISavingsRepository savingsRepository)
    {
        _savingsRepository = savingsRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Savings>>> GetSavings()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var savings = await _savingsRepository.GetByUserIdAsync(userId);
            return Ok(savings);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Savings>> GetSaving(int id)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var saving = await _savingsRepository.GetByIdAsync(id);
            if (saving == null || saving.UserId != userId)
            {
                return NotFound(new { message = "Saving not found" });
            }

            return Ok(saving);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult<Savings>> CreateSaving([FromBody] CreateSavingsDto createSavingsDto)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var saving = new Savings
            {
                Amount = createSavingsDto.Amount,
                Category = createSavingsDto.Category,
                Description = createSavingsDto.Description,
                Date = createSavingsDto.Date,
                GoalAmount = createSavingsDto.GoalAmount,
                TargetDate = createSavingsDto.TargetDate,
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _savingsRepository.AddAsync(saving);
            return CreatedAtAction(nameof(GetSaving), new { id = saving.Id }, saving);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Savings>> UpdateSaving(int id, [FromBody] UpdateSavingsDto updateSavingsDto)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var saving = await _savingsRepository.GetByIdAsync(id);
            if (saving == null || saving.UserId != userId)
            {
                return NotFound(new { message = "Saving not found" });
            }

            saving.Amount = updateSavingsDto.Amount;
            saving.Category = updateSavingsDto.Category;
            saving.Description = updateSavingsDto.Description;
            saving.Date = updateSavingsDto.Date;
            saving.GoalAmount = updateSavingsDto.GoalAmount;
            saving.TargetDate = updateSavingsDto.TargetDate;
            saving.UpdatedAt = DateTime.UtcNow;

            await _savingsRepository.UpdateAsync(saving);
            return Ok(saving);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteSaving(int id)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var saving = await _savingsRepository.GetByIdAsync(id);
            if (saving == null || saving.UserId != userId)
            {
                return NotFound(new { message = "Saving not found" });
            }

            await _savingsRepository.DeleteAsync(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("date-range")]
    public async Task<ActionResult<IEnumerable<Savings>>> GetSavingsByDateRange(
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

            var savings = await _savingsRepository.GetByUserIdAndDateRangeAsync(userId, startDate, endDate);
            return Ok(savings);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
