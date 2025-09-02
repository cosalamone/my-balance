using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyBalance.Core.Entities;
using MyBalance.Core.Interfaces;
using System.Security.Claims;

namespace MyBalance.API.Controllers;

[ApiController]
[Route("api/[controller]")]
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
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "Invalid token" });

        var expenses = await _expenseRepository.GetByUserIdAsync(userId);
        return Ok(expenses);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Expense>> GetById(int id)
    {
        var expense = await _expenseRepository.GetByIdAsync(id);
        if (expense == null)
            return NotFound();
        // Optionally: check if expense.UserId == current user
        return Ok(expense);
    }

    [HttpPost]
    public async Task<ActionResult<Expense>> Create([FromBody] Expense expense)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "Invalid token" });
        expense.UserId = userId;
        expense.CreatedAt = DateTime.UtcNow;
        expense.UpdatedAt = DateTime.UtcNow;
        var created = await _expenseRepository.AddAsync(expense);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Expense expense)
    {
        if (id != expense.Id)
            return BadRequest();
        expense.UpdatedAt = DateTime.UtcNow;
        await _expenseRepository.UpdateAsync(expense);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _expenseRepository.DeleteAsync(id);
        return NoContent();
    }
}
