using System.Text.Json.Serialization;

namespace IoTService.Domain.Entities;

public sealed class BatterySensor: CommonData
{
    [JsonPropertyName("data")]
    public BatteryData Data { get; set; }
    
    public override string ToString()
    {
        return $"ChargeLevel={Data.ChargeLevel}, Voltage={Data.Voltage}, Temperature={Data.Temperature}, Current={Data.Current}";
    }
}

public class BatteryData
{
    [JsonPropertyName("chargeLevel")] 
    public double ChargeLevel { get; set; }
    
    [JsonPropertyName("voltage")]
    public double Voltage { get; set; }
    
    [JsonPropertyName("temperature")]
    public double Temperature { get; set; }
    
    [JsonPropertyName("current")]
    public double Current { get; set; }
}