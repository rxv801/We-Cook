using System.ComponentModel.DataAnnotations;

namespace UniEats.Domain.Entities;

public class User
{
    public Guid UserId { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string DisplayName { get; set; } = string.Empty;

    public string? University { get; set; }
    public string? Campus { get; set; }

    public decimal AvgRating { get; set; } = 0;

    public int StrikeCount { get; set; } = 0;

    public bool IsBannedFromPosting { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<MealListing> MealListings { get; set; } = new List<MealListing>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}
