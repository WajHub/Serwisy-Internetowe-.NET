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

    public async Task InsertAsync(DriveSystemSensor driveSystemSensor)
    {
        await _collection.InsertOneAsync(driveSystemSensor);
    }
    
}