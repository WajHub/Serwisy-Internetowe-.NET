using MQTTnet.Client;
using System.Globalization;

public static class ManualInputHandler
{
    public static async Task HandleManualInputAsync(IMqttClient client, List<SensorConfig> configs)
    {
        while (true)
        {
            var input = Console.ReadLine();
            if (string.IsNullOrWhiteSpace(input)) continue;
            if (input.Equals("q", StringComparison.OrdinalIgnoreCase)) break;

            var parts = input.Split(' ');
            if (parts.Length != 3)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("Wrong format. Try to use:  <SensorId> <FieldName> <Value>");
                Console.WriteLine("Example: VehicleDynamicsSensor-1 speed 133.7");
                Console.ResetColor();
                continue;
            }

            string sensorId = parts[0];
            string propertyName = parts[1];
            string valueStr = parts[2];

            var config = configs.FirstOrDefault(c => c.Id.Equals(sensorId, StringComparison.OrdinalIgnoreCase));
            if (config == null)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"ERROR: Didn't find the sensor with ID '{sensorId}'.");
                Console.ResetColor();
                continue;
            }

            object data = CreateSpecificData(config.Type, propertyName, valueStr);
            if (data == null)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"ERROR: Cannot create data for type '{config.Type}' with field '{propertyName}' and value '{valueStr}'.");
                Console.WriteLine("Check the field name (case-sensitive!) and value format (e.g., 123.4).");
                Console.ResetColor();
                continue;
            }

            await MqttPublisher.PublishMessageAsync(client, config.Type, config.Id, data, "MANUAL");
        }
    }

    private static object CreateSpecificData(string sensorType, string propertyName, string valueStr)
    {
        if (!double.TryParse(valueStr, NumberStyles.Any, CultureInfo.InvariantCulture, out double value))
        {
            return null;
        }

        try
        {
            switch (sensorType)
            {
                case "BatterySensor":
                    var bData = new BatteryData();
                    if (propertyName == "chargeLevel") bData.ChargeLevel = value;
                    else if (propertyName == "voltage") bData.Voltage = value;
                    else if (propertyName == "temperature") bData.Temperature = value;
                    else if (propertyName == "current") bData.Current = value;
                    else return null;
                    return bData;

                case "DriveSystemSensor":
                    var dData = new DriveSystemData();
                    if (propertyName == "rpm") dData.Rpm = (int)value;
                    else if (propertyName == "torque") dData.Torque = value;
                    else if (propertyName == "motorTemperature") dData.MotorTemperature = value;
                    else if (propertyName == "currentDraw") dData.CurrentDraw = value;
                    else return null;
                    return dData;

                case "VehicleDynamicsSensor":
                    var vData = new VehicleDynamicsData();
                    if (propertyName == "speed") vData.Speed = value;
                    else if (propertyName == "acceleration") vData.Acceleration = value;
                    else if (propertyName == "steeringAngle") vData.SteeringAngle = value;
                    else if (propertyName == "tiltAngle") vData.TiltAngle = value;
                    else return null;
                    return vData;

                case "EnvironmentalSensor":
                    var eData = new EnvironmentalData();
                    if (propertyName == "ambientTemperature") eData.AmbientTemperature = value;
                    else if (propertyName == "humidity") eData.Humidity = value;
                    else if (propertyName == "pressure") eData.Pressure = value;
                    else if (propertyName == "lightLevel") eData.LightLevel = value;
                    else return null;
                    return eData;

                default:
                    return null;
            }
        }
        catch (Exception)
        {
            return null;
        }
    }
}