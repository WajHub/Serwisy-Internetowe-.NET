using IoTService.Application;
using IoTService.Application.abstractions;
using IoTService.Infrastructure;
using IoTService.Infrastructure.data;

var builder = WebApplication.CreateBuilder(args);


// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddOpenApi();
builder.Services
    .AddApplication()
    .AddInfrastructure(builder.Configuration);

// CORS: allow frontend dev server(s) to call this API during development.
// Adjust origins as needed for production.
builder.Services.AddCors(options =>
{
    // Development-friendly CORS policy. Allows requests from the frontend dev server.
    // If you still see CORS failures, the browser Origin may differ (127.0.0.1 vs localhost or using https).
    // For a quick development workaround allow any origin (only for dev). Replace with explicit origins for production.
    options.AddPolicy("AllowFrontend", policy =>
    {
        // SetIsOriginAllowed returns true for all origins — useful for development where the exact origin may vary.
        policy.SetIsOriginAllowed(origin => true)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Enable CORS using the policy defined above
app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.UseSwagger();
app.UseSwaggerUI();

var mqttListener = app.Services.GetRequiredService<IMqttListener>();
await mqttListener.StartAsync();

app.Run();