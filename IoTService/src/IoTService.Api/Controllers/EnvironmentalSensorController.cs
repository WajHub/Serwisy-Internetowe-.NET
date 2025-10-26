using IoTService.Application.Services;
using IoTService.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace IoTService.Api.Controllers;

[ApiController]
[Route("/api/sensors/environmental")]
public class EnvironmentalSensorController : ControllerBase
{
    
    private readonly EnvironmentalSensorService _environmentalSensorService;

    public EnvironmentalSensorController(EnvironmentalSensorService environmentalSensorService)
    {
        _environmentalSensorService = environmentalSensorService;
    }

    [HttpGet]
    public async Task<IResult> GetDriveSystem([FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
    {
        var data = await _environmentalSensorService.FindAllAsync(fromDate, toDate);
        return Results.Ok(data);
    }
    
    [HttpGet("{instance}")]
    public async Task<IResult> GetDriveSystemByInstance(string instance, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
    {
        var data = await _environmentalSensorService.FindAllByInstanceAsync(instance, fromDate, toDate);
        return Results.Ok(data);
    }


}