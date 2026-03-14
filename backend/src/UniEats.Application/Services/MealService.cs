using Microsoft.EntityFrameworkCore;
using UniEats.Application.DTOs;
using UniEats.Application.Interfaces;
using UniEats.Domain.Data;
using UniEats.Domain.Entities;
using UniEats.Domain.Enums;

namespace UniEats.Application.Services;

public class MealService : IMealService
{
    private readonly UniEatsDbContext _context;

    public MealService(UniEatsDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<MealDto>> GetFeedAsync(MealType? type = null)
    {
        var query = _context.MealListings.Include(m => m.Cook).AsQueryable();
        
        if (type.HasValue)
            query = query.Where(m => m.Type == type.Value);

        return await query
            .Where(m => m.Status == MealListingStatus.Active && m.ServingsAvailable > 0)
            .OrderByDescending(m => m.CreatedAt)
            .Select(m => MapToDto(m))
            .ToListAsync();
    }

    public async Task<MealDto?> GetMealByIdAsync(Guid mealId)
    {
        var meal = await _context.MealListings.Include(m => m.Cook)
            .FirstOrDefaultAsync(m => m.MealListingId == mealId);
        return meal != null ? MapToDto(meal) : null;
    }

    public async Task<MealDto> CreateMealAsync(Guid cookId, CreateMealDto createDto)
    {
        var cook = await _context.Users.FindAsync(cookId);
        if (cook == null) throw new KeyNotFoundException("User not found");
        if (cook.IsBannedFromPosting || cook.StrikeCount >= 2) throw new InvalidOperationException("User is banned from posting");

        if (createDto.Type == MealType.Rescue && createDto.PriceCents != 0)
            throw new ArgumentException("Rescue meals must have 0 price");

        var meal = new MealListing
        {
            MealListingId = Guid.NewGuid(),
            CookId = cookId,
            Title = createDto.Title,
            Description = createDto.Description,
            Ingredients = createDto.Ingredients,
            Allergens = createDto.Allergens,
            Type = createDto.Type,
            PriceCents = createDto.PriceCents,
            ServingsAvailable = createDto.ServingsAvailable,
            PickupLocationText = createDto.PickupLocationText,
            Status = MealListingStatus.Active,
            CreatedAt = DateTime.UtcNow
        };

        _context.MealListings.Add(meal);
        await _context.SaveChangesAsync();

        return MapToDto(meal);
    }

    private static MealDto MapToDto(MealListing m) => 
        new MealDto(m.MealListingId, m.Title, m.Description, m.Type, m.PriceCents, m.ServingsAvailable, m.PickupLocationText, m.Status, m.CookId, m.Cook?.DisplayName ?? "Unknown");
}
