using System.Text;
using IoTService.Application.abstractions;
using Microsoft.Extensions.Options;
using MQTTnet;
using MQTTnet.Extensions.TopicTemplate;

namespace IoTService.Infrastructure.data;

public class MqttListener : IMqttListener
{
    private readonly MqttSettings _config;
    private readonly IMqttClient _client;

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

            Console.WriteLine($"Recived message on topic: {topic}");
            Console.WriteLine($"Message: {payload}");
        };
        
        MqttTopicTemplate sampleTemplate = new(_config.Topics[0]);
        var mqttSubscribeOptions = new MqttClientFactory().CreateSubscribeOptionsBuilder().WithTopicTemplate(sampleTemplate).Build();
        
        await _client.ConnectAsync(options);
        
        await _client.SubscribeAsync(mqttSubscribeOptions, CancellationToken.None);




    }
}