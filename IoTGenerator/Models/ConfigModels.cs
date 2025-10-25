using System.Globalization;

public readonly struct ValueRange
{
    public double Min { get; }
    public double Max { get; }
    public ValueRange(double min, double max) { Min = min; Max = max; }
    public double GetRandomValue(Random random) => random.NextDouble() * (Max - Min) + Min;
    public int GetRandomIntValue(Random random) => random.Next((int)Min, (int)Max + 1);
    public override string ToString() => $"[{Min}..{Max}]";
}

public abstract class SensorConfig
{
    public string Id { get; } = default!;
    public string Type { get; } = default!;
    public int MessagesPerMinute { get; }
    public int IntervalMs { get; }
    protected SensorConfig(string id, string type, int messagesPerMinute)
    {
        Id = id;
        Type = type;
        if (messagesPerMinute <= 0) messagesPerMinute = 1;
        MessagesPerMinute = messagesPerMinute;
        IntervalMs = 60000 / messagesPerMinute;
    }
}

public class BatterySensorConfig : SensorConfig
{
    public ValueRange ChargeLevelRange { get; }
    public ValueRange VoltageRange { get; }
    public ValueRange TemperatureRange { get; }
    public ValueRange CurrentRange { get; }
    public BatterySensorConfig(string id, int messagesPerMinute, ValueRange chargeLevel, ValueRange voltage, ValueRange temp, ValueRange current)
        : base(id, "BatterySensor", messagesPerMinute)
    {
        ChargeLevelRange = chargeLevel; VoltageRange = voltage; TemperatureRange = temp; CurrentRange = current;
    }
}
public class DriveSystemSensorConfig : SensorConfig
{
    public ValueRange RpmRange { get; }
    public ValueRange TorqueRange { get; }
    public ValueRange MotorTemperatureRange { get; }
    public ValueRange CurrentDrawRange { get; }
    public DriveSystemSensorConfig(string id, int messagesPerMinute, ValueRange rpm, ValueRange torque, ValueRange motorTemp, ValueRange currentDraw)
        : base(id, "DriveSystemSensor", messagesPerMinute)
    {
        RpmRange = rpm; TorqueRange = torque; MotorTemperatureRange = motorTemp; CurrentDrawRange = currentDraw;
    }
}
public class VehicleDynamicsSensorConfig : SensorConfig
{
    public ValueRange SpeedRange { get; }
    public ValueRange AccelerationRange { get; }
    public ValueRange SteeringAngleRange { get; }
    public ValueRange TiltAngleRange { get; }
    public VehicleDynamicsSensorConfig(string id, int messagesPerMinute, ValueRange speed, ValueRange acceleration, ValueRange steeringAngle, ValueRange tiltAngle)
        : base(id, "VehicleDynamicsSensor", messagesPerMinute)
    {
        SpeedRange = speed; AccelerationRange = acceleration; SteeringAngleRange = steeringAngle; TiltAngleRange = tiltAngle;
    }
}
public class EnvironmentalSensorConfig : SensorConfig
{
    public ValueRange AmbientTemperatureRange { get; }
    public ValueRange HumidityRange { get; }
    public ValueRange PressureRange { get; }
    public ValueRange LightLevelRange { get; }
    public EnvironmentalSensorConfig(string id, int messagesPerMinute, ValueRange ambientTemp, ValueRange humidity, ValueRange pressure, ValueRange lightLevel)
        : base(id, "EnvironmentalSensor", messagesPerMinute)
    {
        AmbientTemperatureRange = ambientTemp; HumidityRange = humidity; PressureRange = pressure; LightLevelRange = lightLevel;
    }
}