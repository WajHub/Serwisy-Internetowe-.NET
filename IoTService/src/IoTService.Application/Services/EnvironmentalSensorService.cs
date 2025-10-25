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
    
    public async Task Insert(EnvironmentalSensor sensor)
    {
        await _repository.InsertAsync(sensor);
    }
}