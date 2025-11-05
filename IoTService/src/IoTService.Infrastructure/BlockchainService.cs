using IoTService.Application.abstractions;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using Nethereum.Web3;
using Nethereum.Web3.Accounts;
using System.Numerics;
using Nethereum.Contracts;
using Nethereum.Hex.HexTypes;
using System.Threading;

namespace IoTService.Infrastructure;

public class BlockchainService : IBlockchainService
{
    private readonly BlockchainSettings _settings;
    private readonly ILogger<BlockchainService> _logger;
    private readonly Account _adminAccount;
    private readonly Web3 _web3;
    private readonly string _contractAbi;
    private static readonly SemaphoreSlim _transactionLock = new SemaphoreSlim(1, 1);

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

        if (!string.IsNullOrEmpty(_settings.ContractAbiFilePath))
        {
            try
            {
                _contractAbi = File.ReadAllText(_settings.ContractAbiFilePath);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to read ABI file from path: {Path}", _settings.ContractAbiFilePath);
                throw;
            }
        }
        else if (!string.IsNullOrEmpty(_settings.ContractAbi))
        {
            _contractAbi = _settings.ContractAbi;
        }
        else
        {
            _logger.LogError("Contract ABI is not configured (neither direct nor file path).");
            throw new InvalidOperationException("Contract ABI is missing.");
        }

        _logger.LogInformation("BlockchainService initialized. Contract Address: {ContractAddress}", _settings.ContractAddress);
    }

    public async Task RewardSensor(string sensorId)
    {
        await _transactionLock.WaitAsync();

        try
        {
            if (!_settings.SensorWallets.TryGetValue(sensorId, out var sensorWalletAddress))
            {
                _logger.LogWarning("Wallet address not found for SensorId: {SensorId}. Skipping reward.", sensorId);
                return;
            }

            _logger.LogInformation("Attempting to reward sensor {SensorId} at address {WalletAddress}", sensorId, sensorWalletAddress);

            try
            {
                Contract contract = _web3.Eth.GetContract(_contractAbi, _settings.ContractAddress);
                Function transferFunction = contract.GetFunction("transfer");
                BigInteger amountToSend = BigInteger.Parse("1"); // 1 STK
                _logger.LogInformation("Sending 1 STK to {SensorId} ({WalletAddress})...", sensorId, sensorWalletAddress);

                var gasLimit = new HexBigInteger(50000);

                var transactionReceipt = await transferFunction.SendTransactionAndWaitForReceiptAsync(
                    _adminAccount.Address,
                    null,
                    null,
                    null,
                    sensorWalletAddress,
                    amountToSend
                );
                
                if (transactionReceipt.Status.Value == 1)
                {
                    _logger.LogInformation("Successfully rewarded sensor {SensorId}. Transaction Hash: {TxHash}", sensorId, transactionReceipt.TransactionHash);
                }
                else
                {
                    _logger.LogError("Failed to reward sensor {SensorId}. Transaction failed. Hash: {TxHash}", sensorId, transactionReceipt.TransactionHash);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error rewarding sensor {SensorId}", sensorId);
            }
        }
        finally
        {
            _transactionLock.Release();
        }
    }
}