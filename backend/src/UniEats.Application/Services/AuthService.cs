using Microsoft.EntityFrameworkCore;
using UniEats.Application.DTOs;
using UniEats.Application.Interfaces;
using UniEats.Domain.Data;
using UniEats.Domain.Entities;

namespace UniEats.Application.Services;

public class AuthService : IAuthService
{
    private readonly UniEatsDbContext _context;

    public AuthService(UniEatsDbContext context)
    {
        _context = context;
    }

    public async Task<UserDto> LoginOrRegisterAsync(RegisterUserDto registerDto)
    {
        if (!registerDto.Email.EndsWith(".edu.au", StringComparison.OrdinalIgnoreCase))
            throw new ArgumentException("Email must end with .edu.au");

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == registerDto.Email.ToLower());

        if (user == null)
        {
            user = new User
            {
                UserId = Guid.NewGuid(),
                Email = registerDto.Email.ToLower(),
                DisplayName = registerDto.DisplayName,
                University = registerDto.University,
                Campus = registerDto.Campus,
                CreatedAt = DateTime.UtcNow
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        return MapToDto(user);
    }

    public async Task<UserDto?> GetProfileAsync(Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);
        return user != null ? MapToDto(user) : null;
    }

    private static UserDto MapToDto(User user) => 
        new UserDto(user.UserId, user.Email, user.DisplayName, user.University, user.Campus, user.StrikeCount, user.IsBannedFromPosting);
}
