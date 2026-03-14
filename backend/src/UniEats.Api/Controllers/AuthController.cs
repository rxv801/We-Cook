using Microsoft.AspNetCore.Mvc;
using UniEats.Application.DTOs;
using UniEats.Application.Interfaces;

namespace UniEats.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] RegisterUserDto registerDto)
    {
        try
        {
            var user = await _authService.LoginOrRegisterAsync(registerDto);
            return Ok(user);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetProfile(Guid userId)
    {
        var user = await _authService.GetProfileAsync(userId);
        return user != null ? Ok(user) : NotFound();
    }
}
