using UniEats.Application.DTOs;

namespace UniEats.Application.Interfaces;

public interface IAuthService
{
    Task<UserDto> LoginOrRegisterAsync(RegisterUserDto registerDto);
    Task<UserDto?> GetProfileAsync(Guid userId);
}

public interface IMealService
{
    Task<IEnumerable<MealDto>> GetFeedAsync(UniEats.Domain.Enums.MealType? type = null);
    Task<MealDto?> GetMealByIdAsync(Guid mealId);
    Task<MealDto> CreateMealAsync(Guid cookId, CreateMealDto createDto);
}

public interface IOrderService
{
    Task<OrderDto> PlaceOrderAsync(Guid buyerId, Guid mealId, int quantity);
    Task<OrderDto> ClaimRescueAsync(Guid buyerId, Guid mealId);
    Task<bool> CompleteOrderAsync(Guid userId, Guid orderId);
}
