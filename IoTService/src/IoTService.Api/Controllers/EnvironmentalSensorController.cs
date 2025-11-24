using System.Text;
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
    
    [HttpGet("export/csv")]
    public async Task<IActionResult> ExportCsv([FromQuery] string? instance, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
    {
        var data = instance is null
            ? await _environmentalSensorService.FindAllAsync(fromDate, toDate)
            : await _environmentalSensorService.FindAllByInstanceAsync(instance, fromDate, toDate);

        var csv = GenerateCsv(data);

        return File(
            Encoding.UTF8.GetBytes(csv),
            "text/csv",
            "environmental_export.csv"
        );
    }

    private string GenerateCsv(IEnumerable<EnvironmentalSensor> data)
    {
        var sb = new StringBuilder();
        sb.AppendLine("SensorId,AmbientTemperature,Humidity,Pressure,LightLevel,Timestamp");

        foreach (var r in data)
        {
            sb.AppendLine($"{r.SensorId}," +
                          $"{r.Data.AmbientTemperature}," +
                          $"{r.Data.Humidity}," +
                          $"{r.Data.Pressure}," +
                          $"{r.Data.LightLevel}," +
                          $"{r.Timestamp:O}");
        }

        return sb.ToString();
    }



}