using IoTService.Application.Services;
using IoTService.Domain.Entities;

namespace IoTService.Application.Consumers;

public class DriveSystemConsumer
{
    private readonly DriveSystemSensorService _driveSystemSensorService;

    public DriveSystemConsumer(DriveSystemSensorService driveSystemSensorService)
    {
        _driveSystemSensorService = driveSystemSensorService;
    }
    
    public async Task HandleMessage(DriveSystemSensor driveSystemSensor)
    {
        await _driveSystemSensorService.Insert(driveSystemSensor);
    }   
}