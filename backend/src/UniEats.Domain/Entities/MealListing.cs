using System.ComponentModel.DataAnnotations;
using UniEats.Domain.Enums;

namespace UniEats.Domain.Entities;

public class MealListing
{
    public int MealListingId { get; set; }

    public int CookId { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;

    public MealType Type { get; set; }

    public int PriceCents { get; set; }

    public int ServingsAvailable { get; set; }

    [Timestamp]
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public User Cook { get; set; } = null!;
}
