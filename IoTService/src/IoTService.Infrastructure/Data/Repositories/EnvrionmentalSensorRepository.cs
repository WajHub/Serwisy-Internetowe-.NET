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
    
    public async Task<IEnumerable<EnvironmentalSensor>> FindAllAsync(DateTime fromDate, DateTime toDate)
    {
        var data = await _collection
            .Find(sensor =>  sensor.Timestamp <= fromDate && sensor.Timestamp >= toDate).ToListAsync();
        return data;
    }
    
    public async Task<IEnumerable<EnvironmentalSensor>> FindAllByInstanceAsync(string instance, DateTime fromDate, DateTime toDate)
    {
        var data = await _collection
            .Find(sensor =>  
                sensor.Timestamp <= fromDate && 
                sensor.Timestamp >= toDate &&
                sensor.SensorId == instance
            )
            .ToListAsync();
        return data;
    }

    public async Task InsertAsync(EnvironmentalSensor environmental)
    {
        await _collection.InsertOneAsync(environmental);
    }
}