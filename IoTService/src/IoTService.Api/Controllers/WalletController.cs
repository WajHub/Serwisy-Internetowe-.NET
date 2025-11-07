using IoTService.Application.abstractions;
using Microsoft.AspNetCore.Mvc;

namespace IoTService.Api.Controllers;

[ApiController]
[Route("/api/wallet")]
public class WalletController
{
    private readonly IBlockchainService _service;

    public WalletController(IBlockchainService service)
    {
        _service = service;
    }
    
    [HttpGet("{instance}")]
    public async Task<IResult> GetBalance(string instance, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
    {
        var result = await _service.BalanceOfQueryAsync(instance);
        return Results.Ok(result);
    }
}