using System.Text.Json.Serialization;

namespace IoTService.Domain.Entities;

public class DriveSystemSensor: CommonData
{
    [JsonPropertyName("data")]
    public DriveSystemData Data { get; set; }
}

public class DriveSystemData
{
    [JsonPropertyName("rpm")] 
    public int Rpm { get; set; }
    
    [JsonPropertyName("torque")]
    public double Torque { get; set; }
    
    [JsonPropertyName("motorTemperature")]
    public double MotorTemperature { get; set; }
    
    [JsonPropertyName("currentDraw")]
    public double CurrentDraw { get; set; }
}