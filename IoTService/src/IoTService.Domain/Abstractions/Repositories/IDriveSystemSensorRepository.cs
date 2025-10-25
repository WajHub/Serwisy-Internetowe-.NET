using IoTService.Domain.Entities;

namespace IoTService.Domain.Abstractions.Repositories;

public interface IDriveSystemSensorRepository
{
    Task InsertAsync (DriveSystemSensor driveSystemSensor);
}