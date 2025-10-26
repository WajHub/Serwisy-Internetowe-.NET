using IoTService.Domain.Abstractions.Repositories;
using IoTService.Domain.Entities;

namespace IoTService.Application.Services;

public class VehicleDynamicSensorService
{
    private readonly IVehicleDynamicSensorRepository _repository;

    public VehicleDynamicSensorService(IVehicleDynamicSensorRepository vehicleDynamicSensorRepository)
    {
        _repository = vehicleDynamicSensorRepository;
    }
    public async Task<IEnumerable<VehicleDynamicsSensor>> FindAllAsync(DateTime? fromDate, DateTime? toDate)
    {
        var effectiveToDate = toDate ?? DateTime.Now;
        var effectiveFromDate = fromDate ?? DateTime.MinValue;
        return await _repository.FindAllAsync(effectiveToDate, effectiveFromDate);
    }
    
    public async Task<IEnumerable<VehicleDynamicsSensor>> FindAllByInstanceAsync(string instance, DateTime? fromDate, DateTime? toDate)
    {
        var effectiveToDate = toDate ?? DateTime.Now;
        var effectiveFromDate = fromDate ?? DateTime.MinValue;
        return await _repository.FindAllByInstanceAsync(instance, effectiveToDate, effectiveFromDate);
    }
    
    public async Task Insert(VehicleDynamicsSensor vehicleDynamicsSensor)
    {
        await _repository.InsertAsync(vehicleDynamicsSensor);
    }
}