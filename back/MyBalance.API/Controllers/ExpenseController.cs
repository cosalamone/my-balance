using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyBalance.Core.Entities;
using MyBalance.Core.Interfaces;
using System.Security.Claims;

namespace MyBalance.API.Controllers;

[ApiController]
[Route("api/expenses")]
[Authorize]
public class ExpenseController : ControllerBase
{
    private readonly IExpenseRepository _expenseRepository;

    public ExpenseController(IExpenseRepository expenseRepository)
    {
        _expenseRepository = expenseRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Expense>>> GetAll()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized(new { message = "Invalid token" });

            var expenses = await _expenseRepository.GetByUserIdAsync(userId);
            return Ok(expenses);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error retrieving expenses", details = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Expense>> GetById(int id)
    {
        try
        {
            var expense = await _expenseRepository.GetByIdAsync(id);
            if (expense == null)
                return NotFound(new { message = "Expense not found" });

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId) || expense.UserId != userId)
                return Forbid();

            return Ok(expense);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error retrieving expense", details = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult<Expense>> Create([FromBody] Expense expense)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized(new { message = "Invalid token" });

            // Set user and timestamps
            expense.UserId = userId;
            expense.CreatedAt = DateTime.UtcNow;
            expense.UpdatedAt = DateTime.UtcNow;
            expense.IsFixed = expense.Type == ExpenseType.Fixed;

            var created = await _expenseRepository.AddAsync(expense);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error creating expense", details = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Expense expense)
    {
        try
        {
            if (id != expense.Id)
                return BadRequest(new { message = "ID mismatch" });

            var existingExpense = await _expenseRepository.GetByIdAsync(id);
            if (existingExpense == null)
                return NotFound(new { message = "Expense not found" });

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId) || existingExpense.UserId != userId)
                return Forbid();

            // Preserve creation data and update timestamps
            expense.UserId = userId;
            expense.CreatedAt = existingExpense.CreatedAt;
            expense.UpdatedAt = DateTime.UtcNow;
            expense.IsFixed = expense.Type == ExpenseType.Fixed;

            await _expenseRepository.UpdateAsync(expense);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error updating expense", details = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var expense = await _expenseRepository.GetByIdAsync(id);
            if (expense == null)
                return NotFound(new { message = "Expense not found" });

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId) || expense.UserId != userId)
                return Forbid();

            await _expenseRepository.DeleteAsync(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error deleting expense", details = ex.Message });
        }
    }
}
