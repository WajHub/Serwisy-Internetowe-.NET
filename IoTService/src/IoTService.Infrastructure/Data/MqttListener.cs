using IoTService.Application.abstractions;
using Microsoft.Extensions.Options;
using MQTTnet;

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
            Console.WriteLine("Połączono z brokerem MQTT!");
        };
        //
        // var mqttSubscribeOptions = mqttFactory.CreateSubscribeOptionsBuilder().WithTopicTemplate(sampleTemplate.WithParameter("id", "2")).Build();
        //
        // await mqttClient.SubscribeAsync(mqttSubscribeOptions, CancellationToken.None);


        await _client.ConnectAsync(options);

    }
}