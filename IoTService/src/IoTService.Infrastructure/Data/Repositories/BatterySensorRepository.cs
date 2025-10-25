using IoTService.Domain.Abstractions.Repositories;
using IoTService.Domain.Entities;
using MongoDB.Driver;

namespace IoTService.Infrastructure.data.Repositories;

public class BatterySensorRepository : IBatterySensorRepository
{
    private readonly IMongoCollection<BatterySensor> _collection;

    public BatterySensorRepository(IMongoDatabase mongoDatabase)
    {
        _collection = mongoDatabase.GetCollection<BatterySensor>("Battery");
    }

    public async Task InsertAsync(BatterySensor batterySensor)
    {
        await _collection.InsertOneAsync(batterySensor);
    }
    
}