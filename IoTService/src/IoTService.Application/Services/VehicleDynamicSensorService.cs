using IoTService.Domain.Abstractions.Repositories;
using IoTService.Domain.Entities;

namespace IoTService.Application.Services;

public class VehicleDynamicSensorService
{
    private readonly IVehicleDynamicSensorRepository _vehicleDynamicSensorRepository;

    public VehicleDynamicSensorService(IVehicleDynamicSensorRepository vehicleDynamicSensorRepository)
    {
        _vehicleDynamicSensorRepository = vehicleDynamicSensorRepository;
    }
    
    public async Task Insert(VehicleDynamicsSensor vehicleDynamicsSensor)
    {
        await _vehicleDynamicSensorRepository.InsertAsync(vehicleDynamicsSensor);
    }
}