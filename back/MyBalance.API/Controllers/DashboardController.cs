using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyBalance.Core.DTOs;
using MyBalance.Core.Interfaces;
using System.Security.Claims;

namespace MyBalance.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IFinancialService _financialService;

    public DashboardController(IFinancialService financialService)
    {
        _financialService = financialService;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<FinancialSummaryDto>> GetFinancialSummary()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var summary = await _financialService.GetFinancialSummaryAsync(userId);
            return Ok(summary);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("summary/date-range")]
    public async Task<ActionResult<FinancialSummaryDto>> GetFinancialSummaryByDateRange(
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

            var summary = await _financialService.GetFinancialSummaryByDateRangeAsync(userId, startDate, endDate);
            return Ok(summary);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
