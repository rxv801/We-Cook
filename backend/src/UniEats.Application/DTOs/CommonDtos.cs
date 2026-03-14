using UniEats.Domain.Enums;

namespace UniEats.Application.DTOs;

public record UserDto(Guid UserId, string Email, string DisplayName, string? University, string? Campus, int StrikeCount, bool IsBannedFromPosting);
public record RegisterUserDto(string Email, string DisplayName, string? University, string? Campus);
public record MealDto(Guid MealListingId, string Title, string? Description, MealType Type, int PriceCents, int ServingsAvailable, string? PickupLocationText, MealListingStatus Status, Guid CookId, string CookName);
public record CreateMealDto(string Title, string? Description, string? Ingredients, string? Allergens, MealType Type, int PriceCents, int ServingsAvailable, string? PickupLocationText);
public record OrderDto(Guid OrderId, Guid MealListingId, int Quantity, int TotalPaidCents, OrderStatus Status, DateTime CreatedAt);
