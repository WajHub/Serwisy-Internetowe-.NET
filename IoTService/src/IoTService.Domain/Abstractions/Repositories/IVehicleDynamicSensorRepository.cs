using IoTService.Domain.Entities;

namespace IoTService.Domain.Abstractions.Repositories;

public interface IVehicleDynamicSensorRepository
{
    Task<IEnumerable<VehicleDynamicsSensor>> FindAllAsync(DateTime fromDate, DateTime toDate);
    Task<IEnumerable<VehicleDynamicsSensor>> FindAllByInstanceAsync(string instance, DateTime fromDate, DateTime toDate);
    Task InsertAsync(VehicleDynamicsSensor vehicleDynamicsSensor);
}