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

    public async Task InsertAsync(VehicleDynamicsSensor vehicleDynamicsSensor)
    {
        await _collection.InsertOneAsync(vehicleDynamicsSensor);
    }
}