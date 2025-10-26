using IoTService.Application.Services;
using IoTService.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace IoTService.Api.Controllers;

[ApiController]
[Route("/api/sensors/drive-system")]
public class DriveSystemSensorController : ControllerBase
{
    
    private readonly DriveSystemSensorService _driveSystemSensorService;

    public DriveSystemSensorController(DriveSystemSensorService driveSystemSensorService)
    {
        _driveSystemSensorService = driveSystemSensorService;
    }

    [HttpGet]
    public async Task<IResult> GetDriveSystem([FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
    {
        var data = await _driveSystemSensorService.FindAllAsync(fromDate, toDate);
        return Results.Ok(data);
    }
    
    [HttpGet("{instance}")]
    public async Task<IResult> GetDriveSystemByInstance(string instance, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
    {
        var data = await _driveSystemSensorService.FindAllByInstanceAsync(instance, fromDate, toDate);
        return Results.Ok(data);
    }


}