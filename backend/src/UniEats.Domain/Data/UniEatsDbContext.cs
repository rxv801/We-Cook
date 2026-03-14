using Microsoft.EntityFrameworkCore;
using UniEats.Domain.Entities;

namespace UniEats.Domain.Data;

public class UniEatsDbContext : DbContext
{
    public UniEatsDbContext(DbContextOptions<UniEatsDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<MealListing> MealListings { get; set; } = null!;
    public DbSet<Order> Orders { get; set; } = null!;
    public DbSet<Review> Reviews { get; set; } = null!;
    public DbSet<StrikeEvent> StrikeEvents { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User Configuration
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // Enforce email ending with .edu.au
        modelBuilder.Entity<User>()
            .ToTable(t => t.HasCheckConstraint("CK_User_Email_EduAu", "\"Email\" LIKE '%.edu.au'"));

        // MealListing Configuration
        modelBuilder.Entity<MealListing>()
            .Property(m => m.RowVersion)
            .IsRowVersion();

        // Relationships

        // User -> MealListings (Cook)
        modelBuilder.Entity<MealListing>()
            .HasOne(m => m.Cook)
            .WithMany(u => u.MealListings)
            .HasForeignKey(m => m.CookId)
            .OnDelete(DeleteBehavior.Restrict);

        // User -> Orders (Buyer)
        modelBuilder.Entity<Order>()
            .HasOne(o => o.Buyer)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.BuyerId)
            .OnDelete(DeleteBehavior.Restrict);

        // MealListing -> Orders
        modelBuilder.Entity<Order>()
            .HasOne(o => o.MealListing)
            .WithMany()
            .HasForeignKey(o => o.MealListingId)
            .OnDelete(DeleteBehavior.Restrict);

        // Review Configuration
        modelBuilder.Entity<Review>()
            .HasOne(r => r.Order)
            .WithMany()
            .HasForeignKey(r => r.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        // StrikeEvent Configuration
        modelBuilder.Entity<StrikeEvent>()
            .HasOne(s => s.Cook)
            .WithMany()
            .HasForeignKey(s => s.CookId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<StrikeEvent>()
            .HasOne(s => s.Order)
            .WithMany()
            .HasForeignKey(s => s.OrderId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
