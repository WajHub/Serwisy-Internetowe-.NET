using System.Text;
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
    
    [HttpGet("export/csv")]
    public async Task<IActionResult> ExportCsv([FromQuery] string? instance, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
    {
        var data = instance is null
            ? await _batterySensorService.FindAllAsync(fromDate, toDate)
            : await _batterySensorService.FindAllByInstanceAsync(instance, fromDate, toDate);

        var csv = GenerateCsv(data);

        return File(
            Encoding.UTF8.GetBytes(csv),
            "text/csv",
            "battery_export.csv"
        );
    }
    
    private string GenerateCsv(IEnumerable<BatterySensor> data)
    {
        var sb = new StringBuilder();
        sb.AppendLine("SensorId,ChargeLevel,Temperature,Voltage,Current,Timestamp");

        foreach (var r in data)
        {
            sb.AppendLine($"{r.SensorId}," +
                          $"{r.Data.ChargeLevel}," +
                          $"{r.Data.Temperature}," +
                          $"{r.Data.Voltage}," +
                          $"{r.Data.Current}," +
                          $"{r.Timestamp:O}");
        }

        return sb.ToString();
    }


}