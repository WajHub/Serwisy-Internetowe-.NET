using IoTService.Domain.Entities;

namespace IoTService.Domain.Abstractions.Repositories;

public interface IBatterySensorRepository
{
    Task InsertAsync(BatterySensor batterySensor);
}