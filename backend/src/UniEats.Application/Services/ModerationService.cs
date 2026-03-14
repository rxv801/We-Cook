using Microsoft.EntityFrameworkCore;
using UniEats.Application.Interfaces;
using UniEats.Domain.Data;
using UniEats.Domain.Entities;
using UniEats.Domain.Enums;

namespace UniEats.Application.Services;

public interface IModerationService
{
    Task<bool> FlagOrderAsync(Guid orderId, string reason);
}

public class ModerationService : IModerationService
{
    private readonly UniEatsDbContext _context;

    public ModerationService(UniEatsDbContext context)
    {
        _context = context;
    }

    public async Task<bool> FlagOrderAsync(Guid orderId, string reason)
    {
        var order = await _context.Orders.Include(o => o.MealListing).FirstOrDefaultAsync(o => o.OrderId == orderId);
        if (order == null) return false;

        order.Status = OrderStatus.Flagged;

        var cook = await _context.Users.FindAsync(order.CookId);
        if (cook != null)
        {
            cook.StrikeCount++;
            if (cook.StrikeCount >= 2)
            {
                cook.IsBannedFromPosting = true;
            }

            var strike = new StrikeEvent
            {
                StrikeEventId = Guid.NewGuid(),
                CookId = cook.UserId,
                OrderId = orderId,
                Reason = reason,
                CreatedAt = DateTime.UtcNow
            };

            _context.StrikeEvents.Add(strike);
        }

        await _context.SaveChangesAsync();
        return true;
    }
}
