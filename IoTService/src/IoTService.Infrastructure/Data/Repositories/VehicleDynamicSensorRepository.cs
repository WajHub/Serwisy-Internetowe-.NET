using IoTService.Domain.Abstractions.Repositories;
using IoTService.Domain.Entities;
using MongoDB.Driver;

namespace IoTService.Infrastructure.data.Repositories;

public class VehicleDynamicSensorRepository: IVehicleDynamicSensorRepository
{
    private readonly IMongoCollection<VehicleDynamicsSensor> _collection;

    public VehicleDynamicSensorRepository(IMongoDatabase mongoDatabase)
    {
        _collection = mongoDatabase.GetCollection<VehicleDynamicsSensor>("VehicleDynamics");
    }
    
    public async Task<IEnumerable<VehicleDynamicsSensor>> FindAllAsync(DateTime fromDate, DateTime toDate)
    {
        var data = await _collection
            .Find(sensor =>  sensor.Timestamp <= fromDate && sensor.Timestamp >= toDate).ToListAsync();
        return data;
    }
    
    public async Task<IEnumerable<VehicleDynamicsSensor>> FindAllByInstanceAsync(string instance, DateTime fromDate, DateTime toDate)
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

    public async Task InsertAsync(VehicleDynamicsSensor vehicleDynamicsSensor)
    {
        await _collection.InsertOneAsync(vehicleDynamicsSensor);
    }
}