using IoTService.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace IoTService.Api.Controllers;

[ApiController]
[Route("/api/batteries")]
public class BatterySensorController : ControllerBase
{
    
    private readonly BatterySensorService _batterySensorService;

    public BatterySensorController(BatterySensorService batterySensorService)
    {
        _batterySensorService = batterySensorService;
    }

    [HttpPost]
    public IResult Create()
    {
        _batterySensorService.Create();
        return Results.Ok();
    }


}