using IoTService.Domain.Abstractions.Repositories;
using IoTService.Domain.Entities;

namespace IoTService.Application.Services;

public class DriveSystemSensorService
{
    private readonly IDriveSystemSensorRepository _repository;

    public DriveSystemSensorService(IDriveSystemSensorRepository repository)
    {
        _repository = repository;
    }
    
    public async Task Insert(DriveSystemSensor driveSystemSensor)
    {
        await _repository.InsertAsync(driveSystemSensor);
    }
}