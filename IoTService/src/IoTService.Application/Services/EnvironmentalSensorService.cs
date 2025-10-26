using IoTService.Domain.Abstractions.Repositories;
using IoTService.Domain.Entities;

namespace IoTService.Application.Services;

public class EnvironmentalSensorService
{
    private readonly IEnvironmentalSensorRepository _repository;

    public EnvironmentalSensorService(IEnvironmentalSensorRepository repository)
    {
        _repository = repository;
    }
    
    public async Task<IEnumerable<EnvironmentalSensor>> FindAllAsync(DateTime? fromDate, DateTime? toDate)
    {
        var effectiveToDate = toDate ?? DateTime.Now;
        var effectiveFromDate = fromDate ?? DateTime.MinValue;
        return await _repository.FindAllAsync(effectiveToDate, effectiveFromDate);
    }
    
    public async Task<IEnumerable<EnvironmentalSensor>> FindAllByInstanceAsync(string instance, DateTime? fromDate, DateTime? toDate)
    {
        var effectiveToDate = toDate ?? DateTime.Now;
        var effectiveFromDate = fromDate ?? DateTime.MinValue;
        return await _repository.FindAllByInstanceAsync(instance, effectiveToDate, effectiveFromDate);
    }
    
    public async Task Insert(EnvironmentalSensor sensor)
    {
        await _repository.InsertAsync(sensor);
    }
}