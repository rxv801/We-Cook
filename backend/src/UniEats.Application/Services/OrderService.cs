using Microsoft.EntityFrameworkCore;
using UniEats.Application.DTOs;
using UniEats.Application.Interfaces;
using UniEats.Domain.Data;
using UniEats.Domain.Entities;
using UniEats.Domain.Enums;

namespace UniEats.Application.Services;

public class OrderService : IOrderService
{
    private readonly UniEatsDbContext _context;

    public OrderService(UniEatsDbContext context)
    {
        _context = context;
    }

    public async Task<OrderDto> PlaceOrderAsync(Guid buyerId, Guid mealId, int quantity)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var meal = await _context.MealListings
                .FirstOrDefaultAsync(m => m.MealListingId == mealId);

            if (meal == null || meal.Status != MealListingStatus.Active || meal.ServingsAvailable < quantity)
                throw new InvalidOperationException("Meal unavailable or insufficient servings");

            if (meal.Type == MealType.Rescue)
                throw new InvalidOperationException("Rescue meals must be claimed via ClaimRescueAsync");

            // Fee calculation (5%)
            int buyerFee = (meal.PriceCents * 5 + 50) / 100;
            int makerFee = (meal.PriceCents * 5 + 50) / 100;
            int totalPaid = (meal.PriceCents * quantity) + buyerFee;

            var order = new Order
            {
                OrderId = Guid.NewGuid(),
                MealListingId = mealId,
                BuyerId = buyerId,
                CookId = meal.CookId,
                Quantity = quantity,
                MealPriceCents = meal.PriceCents,
                BuyerFeeCents = buyerFee,
                MakerFeeCents = makerFee,
                TotalPaidCents = totalPaid,
                Status = OrderStatus.PendingPickup,
                CreatedAt = DateTime.UtcNow
            };

            meal.ServingsAvailable -= quantity;
            if (meal.ServingsAvailable == 0) meal.Status = MealListingStatus.SoldOut;

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return MapToDto(order);
        }
        catch (DbUpdateConcurrencyException)
        {
            await transaction.RollbackAsync();
            throw new InvalidOperationException("Concurrency conflict: Someone else might have bought the last serving. Please try again.");
        }
    }

    public async Task<OrderDto> ClaimRescueAsync(Guid buyerId, Guid mealId)
    {
        // Similar to PlaceOrder but with 0 fees and type check
        var meal = await _context.MealListings.FindAsync(mealId);
        if (meal == null || meal.Type != MealType.Rescue || meal.ServingsAvailable < 1)
            throw new InvalidOperationException("Rescue meal unavailable");

        var order = new Order
        {
            OrderId = Guid.NewGuid(),
            MealListingId = mealId,
            BuyerId = buyerId,
            CookId = meal.CookId,
            Quantity = 1,
            MealPriceCents = 0,
            BuyerFeeCents = 0,
            MakerFeeCents = 0,
            TotalPaidCents = 0,
            Status = OrderStatus.PendingPickup,
            CreatedAt = DateTime.UtcNow
        };

        meal.ServingsAvailable -= 1;
        if (meal.ServingsAvailable == 0) meal.Status = MealListingStatus.SoldOut;

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        return MapToDto(order);
    }

    public async Task<bool> CompleteOrderAsync(Guid userId, Guid orderId)
    {
        var order = await _context.Orders.FindAsync(orderId);
        if (order == null || order.BuyerId != userId) return false;

        order.Status = OrderStatus.Completed;
        order.CompletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }

    private static OrderDto MapToDto(Order o) => 
        new OrderDto(o.OrderId, o.MealListingId, o.Quantity, o.TotalPaidCents, o.Status, o.CreatedAt);
}
