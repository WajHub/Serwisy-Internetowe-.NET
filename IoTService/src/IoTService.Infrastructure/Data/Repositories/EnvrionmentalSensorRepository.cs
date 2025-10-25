using IoTService.Domain.Abstractions.Repositories;
using IoTService.Domain.Entities;
using MongoDB.Driver;

namespace IoTService.Infrastructure.data.Repositories;

public class EnvironmentalSensorRepository : IEnvironmentalSensorRepository
{
    private readonly IMongoCollection<EnvironmentalSensor> _collection;

    public EnvironmentalSensorRepository(IMongoDatabase mongoDatabase)
    {
        _collection = mongoDatabase.GetCollection<EnvironmentalSensor>("Environmental");
    }

    public async Task InsertAsync(EnvironmentalSensor environmental)
    {
        await _collection.InsertOneAsync(environmental);
    }
}