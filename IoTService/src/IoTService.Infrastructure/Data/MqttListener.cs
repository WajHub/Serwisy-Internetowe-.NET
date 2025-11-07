using System.Text;
using System.Text.Json;
using IoTService.Application.abstractions;
using IoTService.Application.Consumers;
using IoTService.Domain.Entities;
using Microsoft.Extensions.Options;
using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Extensions.TopicTemplate;
using Microsoft.Extensions.Logging;

namespace IoTService.Infrastructure.data;

public class MqttListener : IMqttListener
{
    private readonly MqttSettings _config;
    private readonly IMqttClient _client;
    private readonly BatteryConsumer _batteryConsumer;
    private readonly DriveSystemConsumer _driveSystemConsumer;
    private readonly EnvironmentalConsumer _environmentalConsumer;
    private readonly VehicleDynamicsConsumer _vehicleDynamicsConsumer;
    private readonly IBlockchainService _blockchainService;
    private readonly ILogger<MqttListener> _logger;

    public MqttListener(
        IOptions<MqttSettings> options,
        BatteryConsumer batteryConsumer,
        DriveSystemConsumer driveSystemConsumer,
        EnvironmentalConsumer environmentalConsumer,
        VehicleDynamicsConsumer vehicleDynamicsConsumer,
        IBlockchainService blockchainService,
        ILogger<MqttListener> logger)
    {
        _config = options.Value;
        _client = new MqttFactory().CreateMqttClient();
        _batteryConsumer = batteryConsumer;
        _driveSystemConsumer = driveSystemConsumer;
        _environmentalConsumer = environmentalConsumer;
        _vehicleDynamicsConsumer = vehicleDynamicsConsumer;
        _blockchainService = blockchainService;
        _logger = logger;
    }

    public async Task StartAsync()
    {
        var options = new MqttClientOptionsBuilder()
            .WithTcpServer(_config.Host, _config.Port)
            .WithClientId(_config.ClientId)
            .Build();

        _client.ConnectedAsync += async e =>
        {
            _logger.LogInformation("Successfully connected to MQTT broker at {Host}:{Port}", _config.Host, _config.Port);
        };

        _client.DisconnectedAsync += async e =>
        {
            _logger.LogWarning("Disconnected from MQTT broker. Reason: {Reason}. Trying to reconnect...", e.ReasonString);
            await Task.Delay(TimeSpan.FromSeconds(5));
            try
            {
                await _client.ConnectAsync(options, CancellationToken.None);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to reconnect to MQTT broker.");
            }
        };

        _client.ApplicationMessageReceivedAsync += async e =>
        {
            string topic = e.ApplicationMessage.Topic;
            string payload = Encoding.UTF8.GetString(e.ApplicationMessage.Payload);
            string? sensorId = ExtractSensorIdFromTopic(topic);

            try
            {
                _logger.LogDebug("Received message on topic: {Topic}", topic);

                if (topic.StartsWith("iot/vehicle/BatterySensor/"))
                {
                    BatterySensor? batterySensor = JsonSerializer.Deserialize<BatterySensor>(payload);
                    if (batterySensor is not null) await _batteryConsumer.HandleMessage(batterySensor);
                    else _logger.LogWarning("Failed to deserialize BatterySensor payload: {Payload}", payload);
                }
                else if (topic.StartsWith("iot/vehicle/DriveSystemSensor/"))
                {
                    DriveSystemSensor? driveSystemSensor = JsonSerializer.Deserialize<DriveSystemSensor>(payload);
                    if (driveSystemSensor is not null) await _driveSystemConsumer.HandleMessage(driveSystemSensor);
                    else _logger.LogWarning("Failed to deserialize DriveSystemSensor payload: {Payload}", payload);
                }
                else if (topic.StartsWith("iot/vehicle/VehicleDynamicsSensor/"))
                {
                    VehicleDynamicsSensor? vehicleDynamicsSensor = JsonSerializer.Deserialize<VehicleDynamicsSensor>(payload);
                    if (vehicleDynamicsSensor is not null) await _vehicleDynamicsConsumer.HandleMessage(vehicleDynamicsSensor);
                    else _logger.LogWarning("Failed to deserialize VehicleDynamicsSensor payload: {Payload}", payload);
                }
                else if (topic.StartsWith("iot/vehicle/EnvironmentalSensor/"))
                {
                    EnvironmentalSensor? environmentalSensor = JsonSerializer.Deserialize<EnvironmentalSensor>(payload);
                    if (environmentalSensor is not null) await _environmentalConsumer.HandleMessage(environmentalSensor);
                    else _logger.LogWarning("Failed to deserialize EnvironmentalSensor payload: {Payload}", payload);
                }
                else
                {
                    _logger.LogWarning("Received message on unknown topic: {Topic}", topic);
                }

                if (!string.IsNullOrEmpty(sensorId))
                {
                    _logger.LogInformation("Message processed for {SensorId}, triggering blockchain reward.", sensorId);
                    _ = Task.Run(() => _blockchainService.RewardSensor(sensorId));
                }
            }
            catch (JsonException jsonEx)
            {
                _logger.LogError(jsonEx, "Failed to deserialize JSON payload for topic {Topic}. Payload: {Payload}", topic, payload);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing message from topic {Topic}", topic);
            }
        };

        MqttTopicTemplate sampleTemplate = new(_config.Topics[0]);
        var mqttSubscribeOptions = new MqttFactory().CreateSubscribeOptionsBuilder().WithTopicTemplate(sampleTemplate).Build();

        await _client.ConnectAsync(options, CancellationToken.None);

        await _client.SubscribeAsync(mqttSubscribeOptions, CancellationToken.None);
    }

    private string? ExtractSensorIdFromTopic(string topic)
    {
        // Format "iot/vehicle/SensorType/SensorId"
        var parts = topic.Split('/');
        if (parts.Length == 4)
        {
            return parts[3];
        }
        _logger.LogWarning("Could not extract SensorId from topic: {Topic}", topic);
        return null;
    }
}

