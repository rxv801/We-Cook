using System.ComponentModel.DataAnnotations;

namespace UniEats.Domain.Entities;

public class StrikeEvent
{
    public Guid StrikeEventId { get; set; }

    public Guid CookId { get; set; }

    public Guid OrderId { get; set; }

    [Required]
    public string Reason { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public User Cook { get; set; } = null!;
    public Order Order { get; set; } = null!;
}
