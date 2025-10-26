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

    public async Task<IEnumerable<BatterySensor>> FindAllAsync(DateTime fromDate, DateTime toDate)
    {
        var batteryData = await _collection
            .Find(sensor =>  sensor.Timestamp <= fromDate && sensor.Timestamp >= toDate).ToListAsync();
        return batteryData;
    }
    
    public async Task<IEnumerable<BatterySensor>> FindAllByInstanceAsync(string instance, DateTime fromDate, DateTime toDate)
    {
        var batteryData = await _collection
            .Find(sensor =>  
                sensor.Timestamp <= fromDate && 
                sensor.Timestamp >= toDate &&
                sensor.SensorId == instance
            )
            .ToListAsync();
        return batteryData;
    }

    public async Task InsertAsync(BatterySensor batterySensor)
    {
        await _collection.InsertOneAsync(batterySensor);
    }
    
}