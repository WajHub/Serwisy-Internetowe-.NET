using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace IoTService.Api.Controllers;

[ApiController]
[Route("/api/ping")]
public class PingController : ControllerBase
{
    private readonly IMongoDatabase _mongoDatabase;
    
    public PingController(IMongoDatabase mongoDatabase)
    {
        _mongoDatabase = mongoDatabase;
    }
    
    [HttpGet]
    public IResult Ping()
    {
        var db = _mongoDatabase.ListCollectionNames().ToList();
        return Results.Ok(new { Message = "Pong", Databases = db});
    }
}