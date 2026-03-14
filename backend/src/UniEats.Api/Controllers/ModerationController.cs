using Microsoft.AspNetCore.Mvc;
using UniEats.Application.Services;

namespace UniEats.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ModerationController : ControllerBase
{
    private readonly IModerationService _moderationService;

    public ModerationController(IModerationService moderationService)
    {
        _moderationService = moderationService;
    }

    [HttpPost("orders/{orderId}/flag")]
    public async Task<IActionResult> FlagOrder(Guid orderId, [FromBody] string reason)
    {
        var success = await _moderationService.FlagOrderAsync(orderId, reason);
        return success ? Ok() : NotFound("Order not found");
    }
}
