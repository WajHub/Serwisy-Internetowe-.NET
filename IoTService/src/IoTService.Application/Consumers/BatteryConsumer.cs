using IoTService.Application.Services;
using IoTService.Domain.Entities;

namespace IoTService.Application.Consumers;

public class BatteryConsumer: IMqttConsumer<BatterySensor>
{
    private readonly BatterySensorService _batterySensorService;

    public BatteryConsumer(BatterySensorService batterySensorService)
    {
        _batterySensorService = batterySensorService;
    }

    public async Task HandleMessage(BatterySensor batteryMessage)
    {
        await _batterySensorService.Insert(batteryMessage);
    }   
}