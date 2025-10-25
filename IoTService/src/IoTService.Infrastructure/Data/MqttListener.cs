using System.Text;
using System.Text.Json;
using IoTService.Application.abstractions;
using IoTService.Application.Consumers;
using IoTService.Domain.Entities;
using Microsoft.Extensions.Options;
using MQTTnet;
using MQTTnet.Extensions.TopicTemplate;

namespace IoTService.Infrastructure.data;

public class MqttListener : IMqttListener
{
    private readonly MqttSettings _config;
    private readonly IMqttClient _client;
    private readonly BatteryConsumer _batteryConsumer = new();

    public MqttListener(IOptions<MqttSettings> options)
    {
        _config = options.Value;
        _client = new MqttClientFactory().CreateMqttClient();
    }

    public async Task StartAsync()
    {
        var options = new MqttClientOptionsBuilder()
            .WithTcpServer(_config.Host, _config.Port)
            .WithClientId(_config.ClientId)
            .Build();

        _client.ConnectedAsync += async e =>
        {
            Console.WriteLine("Connected with MQTT!");
        };

        _client.ApplicationMessageReceivedAsync += async e =>
        {
            string topic = e.ApplicationMessage.Topic;
            string payload = Encoding.UTF8.GetString(e.ApplicationMessage.Payload);

            if (topic.StartsWith("iot/vehicle/BatterySensor/"))
            {
                BatterySensor? batterySensor = 
                    JsonSerializer.Deserialize<BatterySensor>(payload);
                if (batterySensor is not null)
                {
                    await _batteryConsumer.HandleMessage(batterySensor);
                }
                else
                {
                    Console.WriteLine("ERROR!");
                }
            }
            else
            {
                // Console.WriteLine($"Unknown topic {topic}");
            }
        };
        
        MqttTopicTemplate sampleTemplate = new(_config.Topics[0]);
        var mqttSubscribeOptions = new MqttClientFactory().CreateSubscribeOptionsBuilder().WithTopicTemplate(sampleTemplate).Build();
        
        await _client.ConnectAsync(options);
        
        await _client.SubscribeAsync(mqttSubscribeOptions, CancellationToken.None);
    }
}