using System.Text;
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
    
    [HttpGet("export/csv")]
    public async Task<IActionResult> ExportCsv([FromQuery] string? instance, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
    {
        var data = instance is null
            ? await _driveSystemSensorService.FindAllAsync(fromDate, toDate)
            : await _driveSystemSensorService.FindAllByInstanceAsync(instance, fromDate, toDate);

        var csv = GenerateCsv(data);

        return File(
            Encoding.UTF8.GetBytes(csv),
            "text/csv",
            "drive_system_export.csv"
        );
    }

    private string GenerateCsv(IEnumerable<DriveSystemSensor> data)
    {
        var sb = new StringBuilder();
        sb.AppendLine("SensorId,Rpm,Torque,MotorTemperature,CurrentDraw,Timestamp");

        foreach (var r in data)
        {
            sb.AppendLine($"{r.SensorId}," +
                          $"{r.Data.Rpm}," +
                          $"{r.Data.Torque}," +
                          $"{r.Data.MotorTemperature}," +
                          $"{r.Data.CurrentDraw}," +
                          $"{r.Timestamp:O}");
        }

        return sb.ToString();
    }



}