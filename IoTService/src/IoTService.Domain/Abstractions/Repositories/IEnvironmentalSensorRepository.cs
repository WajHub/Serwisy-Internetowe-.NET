using IoTService.Domain.Entities;

namespace IoTService.Domain.Abstractions.Repositories;

public interface IEnvironmentalSensorRepository
{
    Task InsertAsync(EnvironmentalSensor environmentalSensor);
}