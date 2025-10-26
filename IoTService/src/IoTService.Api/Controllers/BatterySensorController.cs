using IoTService.Application.Services;
using IoTService.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace IoTService.Api.Controllers;

[ApiController]
[Route("/api/sensors/battery")]
public class BatterySensorController : ControllerBase
{
    
    private readonly BatterySensorService _batterySensorService;

    public BatterySensorController(BatterySensorService batterySensorService)
    {
        _batterySensorService = batterySensorService;
    }

    [HttpGet]
    public async Task<IResult> GetBattery([FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
    {
        var batteryData = await _batterySensorService.FindAllAsync(fromDate, toDate);
        return Results.Ok(batteryData);
    }
    
    [HttpGet("{instance}")]
    public async Task<IResult> GetBatteryByInstance(string instance, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
    {
        var batteryData = await _batterySensorService.FindAllByInstanceAsync(instance, fromDate, toDate);
        return Results.Ok(batteryData);
    }


}