using IoTService.Application.abstractions;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using Nethereum.Web3;
using Nethereum.Web3.Accounts;
using System.Numerics;
using Nethereum.Hex.HexTypes;
using Nethereum.RPC.Eth.DTOs;
using Solidity.VechicleSensorToken.VechicleSensorToken;
using Solidity.VechicleSensorToken.VechicleSensorToken.ContractDefinition;

namespace IoTService.Infrastructure;

public class BlockchainService : IBlockchainService
{
    private readonly BlockchainSettings _settings;
    private readonly ILogger<BlockchainService> _logger;
    private readonly Account _adminAccount;
    private readonly Web3 _web3;
    private readonly VechicleSensorTokenService _tokenService;

    public BlockchainService(IOptions<BlockchainSettings> options, ILogger<BlockchainService> logger)
    {
        _settings = options.Value;
        _logger = logger;

        if (string.IsNullOrEmpty(_settings.AdminPrivateKey))
        {
            _logger.LogError("Blockchain Admin Private Key is not configured!");
            throw new InvalidOperationException("Admin Private Key is missing.");
        }

        _adminAccount = new Account(_settings.AdminPrivateKey);

        _web3 = new Web3(_adminAccount, _settings.NetworkUrl);

        _tokenService = new VechicleSensorTokenService(_web3, _settings.ContractAddress);
        _logger.LogInformation("BlockchainService initialized. Contract Address: {ContractAddress}",
            _settings.ContractAddress);
    }

    public async Task RewardSensor(string sensorId)
    {
        if (!_settings.SensorWallets.TryGetValue(sensorId, out var sensorWalletAddress))
        {
            _logger.LogWarning("Wallet address not found for SensorId: {SensorId}. Skipping reward.", sensorId);
            return;
        }

        _logger.LogInformation("Attempting to reward sensor {SensorId} at address {WalletAddress}", sensorId,
            sensorWalletAddress);

        try
        {
            BigInteger amountToSend = Web3.Convert.ToWei(1);
            _logger.LogInformation("Sending 1 VST to {SensorId} ({WalletAddress})...", sensorId, sensorWalletAddress);

            var transferMessage = new TransferFunction()
            {
                To = sensorWalletAddress,
                Value = amountToSend,
                Gas = new HexBigInteger(100000) 
            };

            string transactionHash = await _tokenService.TransferRequestAsync(transferMessage);

            _logger.LogInformation(
                "Successfully submitted reward transaction for sensor {SensorId}. Transaction Hash: {TxHash}", sensorId,
                transactionHash);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error submitting reward transaction for sensor {SensorId}", sensorId);
        }
    }

    public async Task<string> BalanceOfQueryAsync(string sensorId)
    {
        if (!_settings.SensorWallets.TryGetValue(sensorId, out var address))
            throw new KeyNotFoundException($"Sensor '{sensorId}' not found.");

        var balance = await _tokenService.BalanceOfQueryAsync(address);
        var decimals = await _tokenService.DecimalsQueryAsync();
        
        var formattedBalance = (decimal)balance / (decimal)Math.Pow(10, decimals);

        return formattedBalance.ToString("0.####");
    }

}