using IoTService.Domain.Entities;

namespace IoTService.Domain.Abstractions.Repositories;

public interface IEnvironmentalSensorRepository
{
    Task<IEnumerable<EnvironmentalSensor>> FindAllAsync(DateTime fromDate, DateTime toDate);
    Task<IEnumerable<EnvironmentalSensor>> FindAllByInstanceAsync(string instance, DateTime fromDate, DateTime toDate);
    Task InsertAsync(EnvironmentalSensor environmentalSensor);
}