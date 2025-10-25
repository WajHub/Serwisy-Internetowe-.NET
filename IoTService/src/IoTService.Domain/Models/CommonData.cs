using System.Text.Json.Serialization;

namespace IoTService.Domain.Entities;

public class CommonData
{
    [JsonPropertyName("sensorId")]
    public string SensorId { get; set; }
    
    [JsonPropertyName("sensorType")] 
    private string SensorType { get; set; }
    
    [JsonPropertyName("timestamp")]
    private DateTime Timestamp { get; set; }
}