using IoTService.Domain.Abstractions.Repositories;

namespace IoTService.Application.Services;

public class BatterySensorService
{
    private readonly IBatterySensorRepository _batterySensorRepository;

    public BatterySensorService(IBatterySensorRepository batterySensorRepository)
    {
        _batterySensorRepository = batterySensorRepository;
    }

    public void Create()
    {
        
    }
}