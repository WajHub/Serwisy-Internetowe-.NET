namespace IoTService.Infrastructure;

public class BlockchainSettings
{
    public string ContractAddress { get; set; } = default!;
    public string NetworkUrl { get; set; } = default!;
    public string AdminPrivateKey { get; set; } = default!;
    public string? ContractAbiFilePath { get; set; }
    public string? ContractAbi { get; set; }

    public Dictionary<string, string> SensorWallets { get; set; } = new();
}