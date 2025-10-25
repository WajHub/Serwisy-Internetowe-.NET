using IoTService.Application;
using IoTService.Application.abstractions;
using IoTService.Infrastructure;
using IoTService.Infrastructure.data;

var builder = WebApplication.CreateBuilder(args);


// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services
    .AddApplication()
    .AddInfrastructure(builder.Configuration);

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

var mqttListener = app.Services.GetRequiredService<IMqttListener>();
await mqttListener.StartAsync();

app.Run();