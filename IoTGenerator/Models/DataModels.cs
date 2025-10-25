using System.Text.Json.Serialization;

public class SensorMessage
{
    [JsonPropertyName("sensorType")] public string SensorType { get; set; } = default!;
    [JsonPropertyName("sensorId")] public string SensorId { get; set; } = default!;
    [JsonPropertyName("timestamp")] public DateTime Timestamp { get; set; }
    [JsonPropertyName("data")] public object Data { get; set; } = default!;
}
public class BatteryData
{
    [JsonPropertyName("chargeLevel")] public double ChargeLevel { get; set; }
    [JsonPropertyName("voltage")] public double Voltage { get; set; }
    [JsonPropertyName("temperature")] public double Temperature { get; set; }
    [JsonPropertyName("current")] public double Current { get; set; }
}
public class DriveSystemData
{
    [JsonPropertyName("rpm")] public int Rpm { get; set; }
    [JsonPropertyName("torque")] public double Torque { get; set; }
    [JsonPropertyName("motorTemperature")] public double MotorTemperature { get; set; }
    [JsonPropertyName("currentDraw")] public double CurrentDraw { get; set; }
}
public class VehicleDynamicsData
{
    [JsonPropertyName("speed")] public double Speed { get; set; }
    [JsonPropertyName("acceleration")] public double Acceleration { get; set; }
    [JsonPropertyName("steeringAngle")] public double SteeringAngle { get; set; }
    [JsonPropertyName("tiltAngle")] public double TiltAngle { get; set; }
}
public class EnvironmentalData
{
    [JsonPropertyName("ambientTemperature")] public double AmbientTemperature { get; set; }
    [JsonPropertyName("humidity")] public double Humidity { get; set; }
    [JsonPropertyName("pressure")] public double Pressure { get; set; }
    [JsonPropertyName("lightLevel")] public double LightLevel { get; set; }
}