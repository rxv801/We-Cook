using Microsoft.AspNetCore.Mvc;
using UniEats.Application.DTOs;
using UniEats.Application.Interfaces;
using UniEats.Domain.Enums;

namespace UniEats.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MealsController : ControllerBase
{
    private readonly IMealService _mealService;

    public MealsController(IMealService mealService)
    {
        _mealService = mealService;
    }

    [HttpGet]
    public async Task<IActionResult> GetFeed([FromQuery] MealType? type)
    {
        var meals = await _mealService.GetFeedAsync(type);
        return Ok(meals);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetMeal(Guid id)
    {
        var meal = await _mealService.GetMealByIdAsync(id);
        return meal != null ? Ok(meal) : NotFound();
    }

    [HttpPost]
    public async Task<IActionResult> CreateMeal([FromQuery] Guid cookId, [FromBody] CreateMealDto createDto)
    {
        try
        {
            var meal = await _mealService.CreateMealAsync(cookId, createDto);
            return CreatedAtAction(nameof(GetMeal), new { id = meal.MealListingId }, meal);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
