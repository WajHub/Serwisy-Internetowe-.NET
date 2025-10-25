using IoTService.Domain.Entities;

namespace IoTService.Application.Consumers;

public class BatteryConsumer: IMqttConsumer<BatterySensor>
{
    public Task HandleMessage(BatterySensor batteryMessage)
    {
        Console.WriteLine("Received Message BATTERY! ");
        Console.WriteLine(batteryMessage.ToString());
        return Task.CompletedTask;
    }   
}