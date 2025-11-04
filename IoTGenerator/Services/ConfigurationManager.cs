using System.Globalization;

public static class ConfigurationManager
{
    public static List<SensorConfig> RunInteractiveSetup()
    {
        Console.WriteLine("Do you want to use default settings or configure manually?");
        Console.Write("Enter 'default' or 'manual': ");
        // string? choice = Console.ReadLine();
        string choice = "default";
        var defaultConfigs = GetDefaultConfigs();

        if (choice?.Equals("manual", StringComparison.OrdinalIgnoreCase) == true)
        {
            return RunManualConfiguration(defaultConfigs);
        }
        else
        {
            Console.WriteLine("Using default settings.");
            return defaultConfigs;
        }
    }

    private static List<SensorConfig> RunManualConfiguration(List<SensorConfig> defaultConfigs)
    {
        var newConfigs = new List<SensorConfig>();
        var configsByType = defaultConfigs.GroupBy(c => c.Type);

        foreach (var group in configsByType)
        {
            var defaultConfig = group.First();
            Console.WriteLine($"\n--- Configuring SENSOR TYPE: {defaultConfig.Type} ---");

            int newSpeed = ReadInt($"Messages per minute (current: {defaultConfig.MessagesPerMinute}): ", defaultConfig.MessagesPerMinute);

            SensorConfig typeTemplateConfig = ConfigureSensorRanges(defaultConfig, newSpeed);

            foreach (var oldConfig in group)
            {
                newConfigs.Add(CreateConfigFromTemplate(oldConfig.Id, typeTemplateConfig));
            }
        }
        return newConfigs;
    }

    private static SensorConfig CreateConfigFromTemplate(string id, SensorConfig templateConfig)
    {
        switch (templateConfig.Type)
        {
            case "BatterySensor":
                var bConf = (BatterySensorConfig)templateConfig;
                return new BatterySensorConfig(id, bConf.MessagesPerMinute, bConf.ChargeLevelRange, bConf.VoltageRange, bConf.TemperatureRange, bConf.CurrentRange);

            case "DriveSystemSensor":
                var dConf = (DriveSystemSensorConfig)templateConfig;
                return new DriveSystemSensorConfig(id, dConf.MessagesPerMinute, dConf.RpmRange, dConf.TorqueRange, dConf.MotorTemperatureRange, dConf.CurrentDrawRange);

            case "VehicleDynamicsSensor":
                var vConf = (VehicleDynamicsSensorConfig)templateConfig;
                return new VehicleDynamicsSensorConfig(id, vConf.MessagesPerMinute, vConf.SpeedRange, vConf.AccelerationRange, vConf.SteeringAngleRange, vConf.TiltAngleRange);

            case "EnvironmentalSensor":
                var eConf = (EnvironmentalSensorConfig)templateConfig;
                return new EnvironmentalSensorConfig(id, eConf.MessagesPerMinute, eConf.AmbientTemperatureRange, eConf.HumidityRange, eConf.PressureRange, eConf.LightLevelRange);

            default:
                throw new InvalidOperationException($"Unknown config type: {templateConfig.Type}");
        }
    }

    private static SensorConfig ConfigureSensorRanges(SensorConfig config, int newSpeed)
    {
        Console.WriteLine("Enter new ranges (format: 'min max') or press Enter to keep current.");

        switch (config.Type)
        {
            case "BatterySensor":
                var bConf = (BatterySensorConfig)config;
                var charge = ReadRange($"  ChargeLevel (current: {bConf.ChargeLevelRange}): ", bConf.ChargeLevelRange);
                var voltage = ReadRange($"  Voltage (current: {bConf.VoltageRange}): ", bConf.VoltageRange);
                var temp = ReadRange($"  Temperature (current: {bConf.TemperatureRange}): ", bConf.TemperatureRange);
                var current = ReadRange($"  Current (current: {bConf.CurrentRange}): ", bConf.CurrentRange);
                // Note: We use config.Id here, but it only serves as a placeholder for the template
                return new BatterySensorConfig(config.Id, newSpeed, charge, voltage, temp, current);

            case "DriveSystemSensor":
                var dConf = (DriveSystemSensorConfig)config;
                var rpm = ReadRange($"  RPM (current: {dConf.RpmRange}): ", dConf.RpmRange);
                var torque = ReadRange($"  Torque (current: {dConf.TorqueRange}): ", dConf.TorqueRange);
                var motorTemp = ReadRange($"  MotorTemp (current: {dConf.MotorTemperatureRange}): ", dConf.MotorTemperatureRange);
                var currentDraw = ReadRange($"  CurrentDraw (current: {dConf.CurrentDrawRange}): ", dConf.CurrentDrawRange);
                return new DriveSystemSensorConfig(config.Id, newSpeed, rpm, torque, motorTemp, currentDraw);

            case "VehicleDynamicsSensor":
                var vConf = (VehicleDynamicsSensorConfig)config;
                var speed = ReadRange($"  Speed (current: {vConf.SpeedRange}): ", vConf.SpeedRange);
                var accel = ReadRange($"  Acceleration (current: {vConf.AccelerationRange}): ", vConf.AccelerationRange);
                var steering = ReadRange($"  SteeringAngle (current: {vConf.SteeringAngleRange}): ", vConf.SteeringAngleRange);
                var tilt = ReadRange($"  TiltAngle (current: {vConf.TiltAngleRange}): ", vConf.TiltAngleRange);
                return new VehicleDynamicsSensorConfig(config.Id, newSpeed, speed, accel, steering, tilt);

            case "EnvironmentalSensor":
                var eConf = (EnvironmentalSensorConfig)config;
                var ambTemp = ReadRange($"  AmbientTemp (current: {eConf.AmbientTemperatureRange}): ", eConf.AmbientTemperatureRange);
                var humidity = ReadRange($"  Humidity (current: {eConf.HumidityRange}): ", eConf.HumidityRange);
                var pressure = ReadRange($"  Pressure (current: {eConf.PressureRange}): ", eConf.PressureRange);
                var light = ReadRange($"  LightLevel (current: {eConf.LightLevelRange}): ", eConf.LightLevelRange);
                return new EnvironmentalSensorConfig(config.Id, newSpeed, ambTemp, humidity, pressure, light);

            default:
                return config;
        }
    }

    private static int ReadInt(string prompt, int defaultValue)
    {
        while (true)
        {
            Console.Write(prompt);
            string? input = Console.ReadLine();
            if (string.IsNullOrEmpty(input))
                return defaultValue;
            if (int.TryParse(input, out int value))
                return value;

            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine("Invalid input. Please enter a number.");
            Console.ResetColor();
        }
    }

    private static ValueRange ReadRange(string prompt, ValueRange defaultRange)
    {
        while (true)
        {
            Console.Write(prompt);
            string? input = Console.ReadLine();
            if (string.IsNullOrEmpty(input))
                return defaultRange;

            var parts = input.Split(' ');
            if (parts.Length == 2 &&
                double.TryParse(parts[0], NumberStyles.Any, CultureInfo.InvariantCulture, out double min) &&
                double.TryParse(parts[1], NumberStyles.Any, CultureInfo.InvariantCulture, out double max))
            {
                return new ValueRange(min, max);
            }

            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine("Invalid format. Please enter two numbers separated by a space (e.g., '10.5 50').");
            Console.ResetColor();
        }
    }

    private static List<SensorConfig> GetDefaultConfigs()
    {
        return new List<SensorConfig>
        {
            new BatterySensorConfig("BatterySensor-1", 4, new ValueRange(20, 100), new ValueRange(350, 400), new ValueRange(15, 45), new ValueRange(-10, 50)),
            new BatterySensorConfig("BatterySensor-2", 3, new ValueRange(20, 100), new ValueRange(350, 400), new ValueRange(15, 45), new ValueRange(-10, 50)),
            new BatterySensorConfig("BatterySensor-3", 4, new ValueRange(20, 100), new ValueRange(350, 400), new ValueRange(15, 45), new ValueRange(-10, 50)),
            new BatterySensorConfig("BatterySensor-4", 3, new ValueRange(20, 100), new ValueRange(350, 400), new ValueRange(15, 45), new ValueRange(-10, 50)),

            new DriveSystemSensorConfig("DriveSystemSensor-1", 5, new ValueRange(0, 8000), new ValueRange(0, 300), new ValueRange(20, 90), new ValueRange(0, 200)),
            new DriveSystemSensorConfig("DriveSystemSensor-2", 5, new ValueRange(0, 8000), new ValueRange(0, 300), new ValueRange(20, 90), new ValueRange(0, 200)),
            new DriveSystemSensorConfig("DriveSystemSensor-3", 4, new ValueRange(0, 8000), new ValueRange(0, 300), new ValueRange(20, 90), new ValueRange(0, 200)),
            new DriveSystemSensorConfig("DriveSystemSensor-4", 4, new ValueRange(0, 8000), new ValueRange(0, 300), new ValueRange(20, 90), new ValueRange(0, 200)),

            new VehicleDynamicsSensorConfig("VehicleDynamicsSensor-1", 10, new ValueRange(0, 120), new ValueRange(-1, 3), new ValueRange(-30, 30), new ValueRange(-5, 5)),
            new VehicleDynamicsSensorConfig("VehicleDynamicsSensor-2", 10, new ValueRange(0, 120), new ValueRange(-1, 3), new ValueRange(-30, 30), new ValueRange(-5, 5)),
            new VehicleDynamicsSensorConfig("VehicleDynamicsSensor-3", 8, new ValueRange(0, 120), new ValueRange(-1, 3), new ValueRange(-30, 30), new ValueRange(-5, 5)),
            new VehicleDynamicsSensorConfig("VehicleDynamicsSensor-4", 8, new ValueRange(0, 120), new ValueRange(-1, 3), new ValueRange(-30, 30), new ValueRange(-5, 5)),

            new EnvironmentalSensorConfig("EnvironmentalSensor-1", 2, new ValueRange(-10, 35), new ValueRange(30, 90), new ValueRange(980, 1050), new ValueRange(0, 1000)),
            new EnvironmentalSensorConfig("EnvironmentalSensor-2", 1, new ValueRange(-10, 35), new ValueRange(30, 90), new ValueRange(980, 1050), new ValueRange(0, 1000)),
            new EnvironmentalSensorConfig("EnvironmentalSensor-3", 2, new ValueRange(-10, 35), new ValueRange(30, 90), new ValueRange(980, 1050), new ValueRange(0, 1000)),
            new EnvironmentalSensorConfig("EnvironmentalSensor-4", 1, new ValueRange(-10, 35), new ValueRange(30, 90), new ValueRange(980, 1050), new ValueRange(0, 1000))
        };
    }
}