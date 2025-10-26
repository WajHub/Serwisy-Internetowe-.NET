using IoTService.Domain.Entities;

namespace IoTService.Domain.Abstractions.Repositories;

public interface IBatterySensorRepository
{
    Task<IEnumerable<BatterySensor>> FindAllAsync(DateTime fromDate, DateTime toDate);
    Task<IEnumerable<BatterySensor>> FindAllByInstanceAsync(string instance, DateTime fromDate, DateTime toDate);
    Task InsertAsync(BatterySensor batterySensor);
}