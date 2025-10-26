using IoTService.Domain.Entities;

namespace IoTService.Domain.Abstractions.Repositories;

public interface IDriveSystemSensorRepository
{
    Task<IEnumerable<DriveSystemSensor>> FindAllAsync(DateTime fromDate, DateTime toDate);
    Task<IEnumerable<DriveSystemSensor>> FindAllByInstanceAsync(string instance, DateTime fromDate, DateTime toDate);
    Task InsertAsync (DriveSystemSensor driveSystemSensor);
}