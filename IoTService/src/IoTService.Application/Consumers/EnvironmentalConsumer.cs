using IoTService.Application.Services;
using IoTService.Domain.Entities;

namespace IoTService.Application.Consumers;

public class EnvironmentalConsumer
{
    private readonly EnvironmentalSensorService _environmentalSensorService;

    public EnvironmentalConsumer(EnvironmentalSensorService environmentalSensorService)
    {
        _environmentalSensorService = environmentalSensorService;
    }
    
    public async Task HandleMessage(EnvironmentalSensor environmentalSensor)
    {
        await _environmentalSensorService.Insert(environmentalSensor);
    }   
}