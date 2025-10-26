using IoTService.Application.Services;
using IoTService.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace IoTService.Api.Controllers;

[ApiController]
[Route("/api/sensors/vehicle-dynamic")]
public class VehicleDynamicSensorController : ControllerBase
{
    
    private readonly VehicleDynamicSensorService _vehicleDynamicSensorService;

    public VehicleDynamicSensorController(VehicleDynamicSensorService vehicleDynamicSensorService)
    {
        _vehicleDynamicSensorService = vehicleDynamicSensorService;
    }

    [HttpGet]
    public async Task<IResult> GetDriveSystem([FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
    {
        var data = await _vehicleDynamicSensorService.FindAllAsync(fromDate, toDate);
        return Results.Ok(data);
    }
    
    [HttpGet("{instance}")]
    public async Task<IResult> GetDriveSystemByInstance(string instance, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
    {
        var data = await _vehicleDynamicSensorService.FindAllByInstanceAsync(instance, fromDate, toDate);
        return Results.Ok(data);
    }


}