using System.ComponentModel.DataAnnotations;

namespace UniEats.Domain.Entities;

public class Review
{
    public Guid ReviewId { get; set; }

    public Guid OrderId { get; set; }

    public Guid CookId { get; set; } // Denormalized
    public Guid BuyerId { get; set; } // Denormalized

    [Range(1, 5)]
    public int Stars { get; set; }

    public string? Comment { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public Order Order { get; set; } = null!;
}
