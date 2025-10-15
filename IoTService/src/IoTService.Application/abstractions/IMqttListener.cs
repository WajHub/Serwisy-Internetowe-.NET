namespace IoTService.Application.abstractions;

public interface IMqttListener
{
    Task StartAsync();
}