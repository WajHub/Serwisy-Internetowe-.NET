using System.Numerics;

namespace IoTService.Application.abstractions;

public interface IBlockchainService
{
    Task RewardSensor(string sensorId);
    Task<string> BalanceOfQueryAsync(string owner);
}