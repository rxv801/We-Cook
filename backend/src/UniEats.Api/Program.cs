using Microsoft.EntityFrameworkCore;
using UniEats.Domain.Data;
using UniEats.Application.Interfaces;
using UniEats.Application.Services;

var builder = WebApplication.CreateBuilder(args);

// PostgreSQL connection from environment (port 5432); password must be set in env.
var dbHost = builder.Configuration["POSTGRES_HOST"] ?? "localhost";
var dbPort = builder.Configuration["POSTGRES_PORT"] ?? "5432";
var dbName = builder.Configuration["POSTGRES_DB"] ?? "UniEatsDb";
var dbUser = builder.Configuration["POSTGRES_USER"] ?? "postgres";
var dbPassword = builder.Configuration["POSTGRES_PASSWORD"] ?? "";
var connectionString = $"Host={dbHost};Port={dbPort};Database={dbName};Username={dbUser};Password={dbPassword}";

builder.Services.AddDbContext<UniEatsDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IMealService, MealService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IModerationService, ModerationService>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.UseHttpsRedirection();

app.MapControllers();

app.MapGet("/", () => Results.Redirect("/swagger"));

app.Run();

