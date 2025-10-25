using IoTService.Domain.Abstractions.Repositories;
using IoTService.Domain.Entities;

namespace IoTService.Application.Services;

public class BatterySensorService
{
    private readonly IBatterySensorRepository _batterySensorRepository;

    public BatterySensorService(IBatterySensorRepository batterySensorRepository)
    {
        _batterySensorRepository = batterySensorRepository;
    }

    public async Task Insert(BatterySensor batterySensor)
    {
        await _batterySensorRepository.InsertAsync(batterySensor);
    }
}