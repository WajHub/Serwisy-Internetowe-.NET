using MQTTnet.Client;

public static class SensorSimulator
{
    public static async Task SimulateSensorAsync(IMqttClient client, SensorConfig sensor)
    {
        var random = new Random();

        while (true)
        {
            var sensorData = GenerateSensorData(sensor, random);
            await MqttPublisher.PublishMessageAsync(client, sensor.Type, sensor.Id, sensorData, "AUTO");
            int randomJitter = random.Next(-1000, 1000);
            await Task.Delay(sensor.IntervalMs + randomJitter);
        }
    }

    private static object GenerateSensorData(SensorConfig sensor, Random random)
    {
        switch (sensor.Type)
        {
            case "BatterySensor":
                var configB = (BatterySensorConfig)sensor;
                return new BatteryData
                {
                    ChargeLevel = configB.ChargeLevelRange.GetRandomValue(random),
                    Voltage = configB.VoltageRange.GetRandomValue(random),
                    Temperature = configB.TemperatureRange.GetRandomValue(random),
                    Current = configB.CurrentRange.GetRandomValue(random)
                };
            case "DriveSystemSensor":
                var configD = (DriveSystemSensorConfig)sensor;
                return new DriveSystemData
                {
                    Rpm = configD.RpmRange.GetRandomIntValue(random),
                    Torque = configD.TorqueRange.GetRandomValue(random),
                    MotorTemperature = configD.MotorTemperatureRange.GetRandomValue(random),
                    CurrentDraw = configD.CurrentDrawRange.GetRandomValue(random)
                };
            case "VehicleDynamicsSensor":
                var configV = (VehicleDynamicsSensorConfig)sensor;
                return new VehicleDynamicsData
                {
                    Speed = configV.SpeedRange.GetRandomValue(random),
                    Acceleration = configV.AccelerationRange.GetRandomValue(random),
                    SteeringAngle = configV.SteeringAngleRange.GetRandomValue(random),
                    TiltAngle = configV.TiltAngleRange.GetRandomValue(random)
                };
            case "EnvironmentalSensor":
                var configE = (EnvironmentalSensorConfig)sensor;
                return new EnvironmentalData
                {
                    AmbientTemperature = configE.AmbientTemperatureRange.GetRandomValue(random),
                    Humidity = configE.HumidityRange.GetRandomValue(random),
                    Pressure = configE.PressureRange.GetRandomValue(random),
                    LightLevel = configE.LightLevelRange.GetRandomValue(random)
                };
            default:
                return new object();
        }
    }
}