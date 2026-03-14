using System.ComponentModel.DataAnnotations;
using UniEats.Domain.Enums;

namespace UniEats.Domain.Entities;

public class Order
{
    public Guid OrderId { get; set; }

    public Guid MealListingId { get; set; }

    public Guid BuyerId { get; set; }

    public Guid CookId { get; set; } // Denormalized for convenience

    public int Quantity { get; set; } = 1;

    public int MealPriceCents { get; set; }
    public int BuyerFeeCents { get; set; }
    public int MakerFeeCents { get; set; }
    public int TotalPaidCents { get; set; }

    public OrderStatus Status { get; set; } = OrderStatus.PendingPickup;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }

    // Navigation properties
    public MealListing MealListing { get; set; } = null!;
    public User Buyer { get; set; } = null!;
}
