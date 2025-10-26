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
    
    public async Task<IEnumerable<DriveSystemSensor>> FindAllAsync(DateTime? fromDate, DateTime? toDate)
    {
        var effectiveToDate = toDate ?? DateTime.Now;
        var effectiveFromDate = fromDate ?? DateTime.MinValue;
        return await _repository.FindAllAsync(effectiveToDate, effectiveFromDate);
    }
    
    public async Task<IEnumerable<DriveSystemSensor>> FindAllByInstanceAsync(string instance, DateTime? fromDate, DateTime? toDate)
    {
        var effectiveToDate = toDate ?? DateTime.Now;
        var effectiveFromDate = fromDate ?? DateTime.MinValue;
        return await _repository.FindAllByInstanceAsync(instance, effectiveToDate, effectiveFromDate);
    }

    
    public async Task Insert(DriveSystemSensor driveSystemSensor)
    {
        await _repository.InsertAsync(driveSystemSensor);
    }
}