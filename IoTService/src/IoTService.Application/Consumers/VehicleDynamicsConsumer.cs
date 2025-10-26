using IoTService.Application.Services;
using IoTService.Domain.Entities;

namespace IoTService.Application.Consumers;

public class VehicleDynamicsConsumer
{
    private readonly VehicleDynamicSensorService _vehicleDynamicSensorService;

    public VehicleDynamicsConsumer(VehicleDynamicSensorService vehicleDynamicSensorService)
    {
        _vehicleDynamicSensorService = vehicleDynamicSensorService;
    }
    
    public async Task HandleMessage(VehicleDynamicsSensor vehicleDynamicsSensor)
    {
        await _vehicleDynamicSensorService.Insert(vehicleDynamicsSensor);
    }   
}