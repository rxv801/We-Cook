using Microsoft.AspNetCore.Mvc;
using UniEats.Application.Interfaces;

namespace UniEats.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost]
    public async Task<IActionResult> PlaceOrder([FromQuery] Guid buyerId, [FromQuery] Guid mealId, [FromQuery] int quantity = 1)
    {
        try
        {
            var order = await _orderService.PlaceOrderAsync(buyerId, mealId, quantity);
            return Ok(order);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("rescue-claim")]
    public async Task<IActionResult> ClaimRescue([FromQuery] Guid buyerId, [FromQuery] Guid mealId)
    {
        try
        {
            var order = await _orderService.ClaimRescueAsync(buyerId, mealId);
            return Ok(order);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("{orderId}/complete")]
    public async Task<IActionResult> CompleteOrder(Guid orderId, [FromQuery] Guid userId)
    {
        var success = await _orderService.CompleteOrderAsync(userId, orderId);
        return success ? Ok() : BadRequest("Could not complete order. Check if you are the buyer.");
    }
}
