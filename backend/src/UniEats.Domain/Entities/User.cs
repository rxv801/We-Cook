using System.ComponentModel.DataAnnotations;

namespace UniEats.Domain.Entities;

public class User
{
    public int UserId { get; set; }

    [Required]
    [EmailAddress]
    // Custom validation logic will be enforced in the service layer or Fluent API check constraint
    public string Email { get; set; } = string.Empty;

    [Required]
    public string DisplayName { get; set; } = string.Empty;

    public int StrikeCount { get; set; } = 0;

    public bool IsBannedFromPosting { get; set; } = false;

    // Navigation properties
    public ICollection<MealListing> MealListings { get; set; } = new List<MealListing>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}
