namespace IoTService.Domain.Entities;

public sealed class BatterySensor : CommonData
{
    private double ChargeLevel { get; set; }
    private double Voltage { get; set; }
    private double Temperature { get; set; }
    private double Current { get; set; }
}