using IoTService.Domain.Entities;

namespace IoTService.Domain.Abstractions.Repositories;

public interface IVehicleDynamicSensorRepository
{
    Task InsertAsync(VehicleDynamicsSensor vehicleDynamicsSensor);
}