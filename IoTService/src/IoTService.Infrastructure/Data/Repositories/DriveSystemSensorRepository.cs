using IoTService.Domain.Abstractions.Repositories;
using IoTService.Domain.Entities;
using MongoDB.Driver;

namespace IoTService.Infrastructure.data.Repositories;

public class DriveSystemSensorRepository : IDriveSystemSensorRepository
{
    private readonly IMongoCollection<DriveSystemSensor> _collection;

    public DriveSystemSensorRepository(IMongoDatabase mongoDatabase)
    {
        _collection = mongoDatabase.GetCollection<DriveSystemSensor>("DriveSystem");
    }
    
    public async Task<IEnumerable<DriveSystemSensor>> FindAllAsync(DateTime fromDate, DateTime toDate)
    {
        var data = await _collection
            .Find(sensor =>  sensor.Timestamp <= fromDate && sensor.Timestamp >= toDate).ToListAsync();
        return data;
    }
    
    public async Task<IEnumerable<DriveSystemSensor>> FindAllByInstanceAsync(string instance, DateTime fromDate, DateTime toDate)
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


    public async Task InsertAsync(DriveSystemSensor driveSystemSensor)
    {
        await _collection.InsertOneAsync(driveSystemSensor);
    }
    
}