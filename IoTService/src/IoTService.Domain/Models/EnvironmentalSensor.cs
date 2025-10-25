using System.Text.Json.Serialization;

namespace IoTService.Domain.Entities;

public class EnvironmentalSensor: CommonData
{
    [JsonPropertyName("data")]
    public EnvironmentalData Data { get; set; }
}

public class EnvironmentalData
{
    [JsonPropertyName("ambientTemperature")] 
    public double AmbientTemperature { get; set; }
    
    [JsonPropertyName("humidity")]
    public double Humidity { get; set; }
    
    [JsonPropertyName("pressure")]
    public double Pressure { get; set; }
    
    [JsonPropertyName("lightLevel")]
    public double LightLevel { get; set; }
}