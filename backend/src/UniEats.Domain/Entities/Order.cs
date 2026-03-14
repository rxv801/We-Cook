using System.ComponentModel.DataAnnotations;
using UniEats.Domain.Enums;

namespace UniEats.Domain.Entities;

public class Order
{
    public int OrderId { get; set; }

    public int MealListingId { get; set; }

    public int BuyerId { get; set; }

    public int TotalPaidCents { get; set; }

    public OrderStatus Status { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public MealListing MealListing { get; set; } = null!;
    public User Buyer { get; set; } = null!;
}
