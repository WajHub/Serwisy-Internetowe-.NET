using MQTTnet;
using MQTTnet.Client;
using System.Globalization;

// Set the dot as decimal separator
CultureInfo.DefaultThreadCurrentCulture = CultureInfo.InvariantCulture;
CultureInfo.DefaultThreadCurrentUICulture = CultureInfo.InvariantCulture;

Console.WriteLine("Sensor Data Generator starting...");

var sensorConfigs = ConfigurationManager.RunInteractiveSetup();

Console.WriteLine("Configuration complete. Connecting to MQTT broker...");

string mqttHost = "localhost";
int mqttPort = 1883;

var factory = new MqttFactory();
var mqttClient = factory.CreateMqttClient();

var options = new MqttClientOptionsBuilder()
    .WithTcpServer(mqttHost, mqttPort)
    .WithClientId($"sensor-generator-{Guid.NewGuid()}")
    .Build();

await mqttClient.ConnectAsync(options, CancellationToken.None);
Console.WriteLine("Connected to MQTT broker.");

Console.WriteLine($"Starting automatic simulation...");
var simulationTasks = new List<Task>();
var random = new Random();

foreach (var sensor in sensorConfigs)
{
    simulationTasks.Add(SensorSimulator.SimulateSensorAsync(mqttClient, sensor));
    await Task.Delay(random.Next(200, 500));
}
var simulationTask = Task.WhenAll(simulationTasks);

Console.ForegroundColor = ConsoleColor.Green;
Console.WriteLine("----------------------------------------------------------------------");
Console.WriteLine("To send a specific data value, use the format below and press Enter.");
Console.WriteLine("Format: <SensorId> <FieldName> <Value>");
Console.WriteLine("Example: VehicleDynamicsSensor-1 speed 133.7");
Console.WriteLine("Press 'q' to quit.");
Console.WriteLine("----------------------------------------------------------------------");
Console.ResetColor();

await ManualInputHandler.HandleManualInputAsync(mqttClient, sensorConfigs);

Console.WriteLine("Generator shutting down...");
await mqttClient.DisconnectAsync();