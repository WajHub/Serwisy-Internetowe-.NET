using MQTTnet;
using MQTTnet.Client;
using System.Text.Json;

public static class MqttPublisher
{
    public static async Task PublishMessageAsync(IMqttClient client, string sensorType, string sensorId, object data, string mode)
    {
        var message = new SensorMessage
        {
            SensorId = sensorId,
            SensorType = sensorType,
            Timestamp = DateTime.UtcNow,
            Data = data
        };

        string payload = JsonSerializer.Serialize(message);
        string topic = $"iot/vehicle/{sensorType}/{sensorId}";

        var applicationMessage = new MqttApplicationMessageBuilder()
            .WithTopic(topic)
            .WithPayload(payload)
            .Build();

        await client.PublishAsync(applicationMessage, CancellationToken.None);

        // Only log MANUAL messages to avoid console flooding
        if (mode == "MANUAL")
        {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine($"---> [{mode}] Published to {topic}: {payload}");
            Console.ResetColor();
        }
    }
}