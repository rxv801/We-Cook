using System.ComponentModel.DataAnnotations;

namespace UniEats.Domain.Entities;

public class Review
{
    public int ReviewId { get; set; }

    public int OrderId { get; set; }

    [Range(1, 5)]
    public int Rating { get; set; }

    public string? Comment { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public Order Order { get; set; } = null!;
}
