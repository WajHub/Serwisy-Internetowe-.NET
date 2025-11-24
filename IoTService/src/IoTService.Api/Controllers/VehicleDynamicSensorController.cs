using System.Text;
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
    
    [HttpGet("export/csv")]
    public async Task<IActionResult> ExportCsv([FromQuery] string? instance, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
    {
        var data = instance is null
            ? await _vehicleDynamicSensorService.FindAllAsync(fromDate, toDate)
            : await _vehicleDynamicSensorService.FindAllByInstanceAsync(instance, fromDate, toDate);

        var csv = GenerateCsv(data);

        return File(
            Encoding.UTF8.GetBytes(csv),
            "text/csv",
            "vehicle_dynamics_export.csv"
        );
    }

    private string GenerateCsv(IEnumerable<VehicleDynamicsSensor> data)
    {
        var sb = new StringBuilder();
        sb.AppendLine("SensorId,Speed,Acceleration,SteeringAngle,TiltAngle,Timestamp");

        foreach (var r in data)
        {
            sb.AppendLine($"{r.SensorId}," +
                          $"{r.Data.Speed}," +
                          $"{r.Data.Acceleration}," +
                          $"{r.Data.SteeringAngle}," +
                          $"{r.Data.TiltAngle}," +
                          $"{r.Timestamp:O}");
        }

        return sb.ToString();
    }



}