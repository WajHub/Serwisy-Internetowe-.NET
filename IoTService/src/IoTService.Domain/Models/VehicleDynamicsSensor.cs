using System.Text.Json.Serialization;

namespace IoTService.Domain.Entities;

public class VehicleDynamicsSensor: CommonData
{
    [JsonPropertyName("data")]
    public VehicleDynamicsData Data { get; set; }
}

public class VehicleDynamicsData
{
    [JsonPropertyName("speed")] 
    public double Speed { get; set; }
    
    [JsonPropertyName("acceleration")]
    public double Acceleration { get; set; }
    
    [JsonPropertyName("steeringAngle")]
    public double SteeringAngle { get; set; }
    
    [JsonPropertyName("tiltAngle")]
    public double TiltAngle { get; set; }
}