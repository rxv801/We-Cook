using System.ComponentModel.DataAnnotations;
using UniEats.Domain.Enums;

namespace UniEats.Domain.Entities;

public class MealListing
{
    public Guid MealListingId { get; set; }

    public Guid CookId { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string? Ingredients { get; set; }

    public string? Allergens { get; set; }

    public string? ImageUrl { get; set; }

    public MealType Type { get; set; }

    public int PriceCents { get; set; }

    public int ServingsAvailable { get; set; }

    public string? PickupLocationText { get; set; }
    public decimal? PickupLat { get; set; }
    public decimal? PickupLng { get; set; }

    public MealListingStatus Status { get; set; } = MealListingStatus.Active;

    [Timestamp]
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public User Cook { get; set; } = null!;
}
