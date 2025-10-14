using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace IoTService.Api.Controllers;

[ApiController]
[Route("/api/ping")]
public class PingController : ControllerBase
{
    private readonly IMongoClient _mongoClient;
    
    public PingController(IMongoClient mongoClient)
    {
        _mongoClient = mongoClient;
    }
    
    [HttpGet]
    public IResult Ping()
    {
        var db = _mongoClient.ListDatabaseNames().ToList();
        return Results.Ok(new { Message = "Pong", Databases = db});
    }
}