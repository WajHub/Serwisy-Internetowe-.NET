using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace IoTService.Domain.Entities;

public class CommonData
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }
    
    [JsonPropertyName("sensorId")]
    public string SensorId { get; set; }
    
    [JsonPropertyName("sensorType")] 
    public string SensorType { get; set; }
    
    [JsonPropertyName("timestamp")]
    public DateTime Timestamp { get; set; }
}