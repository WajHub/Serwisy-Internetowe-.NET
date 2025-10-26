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
    private readonly BatteryConsumer _batteryConsumer;
    private readonly DriveSystemConsumer _driveSystemConsumer;
    private readonly EnvironmentalConsumer _environmentalConsumer;
    private readonly VehicleDynamicsConsumer _vehicleDynamicsConsumer;

    public MqttListener(
        IOptions<MqttSettings> options, 
        BatteryConsumer batteryConsumer, 
        DriveSystemConsumer driveSystemConsumer, 
        EnvironmentalConsumer environmentalConsumer, 
        VehicleDynamicsConsumer vehicleDynamicsConsumer)
    {
        _config = options.Value;
        _client = new MqttClientFactory().CreateMqttClient();
        _batteryConsumer = batteryConsumer;
        _driveSystemConsumer = driveSystemConsumer;
        _environmentalConsumer = environmentalConsumer;
        _vehicleDynamicsConsumer = vehicleDynamicsConsumer;
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
            else if (topic.StartsWith("iot/vehicle/DriveSystemSensor/"))
            {
                DriveSystemSensor? driveSystemSensor = 
                    JsonSerializer.Deserialize<DriveSystemSensor>(payload);
                if (driveSystemSensor is not null)
                {
                    await _driveSystemConsumer.HandleMessage(driveSystemSensor);
                }
                else
                {
                    Console.WriteLine("ERROR!");
                }
            }
            else if (topic.StartsWith("iot/vehicle/VehicleDynamicsSensor/"))
            {
                VehicleDynamicsSensor? vehicleDynamicsSensor = 
                    JsonSerializer.Deserialize<VehicleDynamicsSensor>(payload);
                if (vehicleDynamicsSensor is not null)
                {
                    await _vehicleDynamicsConsumer.HandleMessage(vehicleDynamicsSensor);
                }
                else
                {
                    Console.WriteLine("ERROR!");
                }
            }
            else if (topic.StartsWith("iot/vehicle/EnvironmentalSensor/"))
            {
                EnvironmentalSensor? environmentalSensor = 
                    JsonSerializer.Deserialize<EnvironmentalSensor>(payload);
                if (environmentalSensor is not null)
                {
                    await _environmentalConsumer.HandleMessage(environmentalSensor);
                }
                else
                {
                    Console.WriteLine("ERROR!");
                }
            }
            else
            {
                Console.WriteLine($"Unknown topic {topic}");
            }
        };
        
        MqttTopicTemplate sampleTemplate = new(_config.Topics[0]);
        var mqttSubscribeOptions = new MqttClientFactory().CreateSubscribeOptionsBuilder().WithTopicTemplate(sampleTemplate).Build();
        
        await _client.ConnectAsync(options);
        
        await _client.SubscribeAsync(mqttSubscribeOptions, CancellationToken.None);
    }
}