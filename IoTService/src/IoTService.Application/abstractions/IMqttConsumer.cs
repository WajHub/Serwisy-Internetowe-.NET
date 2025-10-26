namespace IoTService.Application.Consumers;

public interface IMqttConsumer<in T>
{
    Task HandleMessage(T message);
}