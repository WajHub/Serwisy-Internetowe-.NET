namespace IoTService.Application.abstractions;

public interface IBlockchainService
{
    Task RewardSensor(string sensorId);
}