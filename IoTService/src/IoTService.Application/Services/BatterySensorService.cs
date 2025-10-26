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

    public async Task<IEnumerable<BatterySensor>> FindAllAsync(DateTime? fromDate, DateTime? toDate)
    {
        var effectiveToDate = toDate ?? DateTime.Now;
        var effectiveFromDate = fromDate ?? DateTime.MinValue;
        return await _batterySensorRepository.FindAllAsync(effectiveToDate, effectiveFromDate);
    }
    
    public async Task<IEnumerable<BatterySensor>> FindAllByInstanceAsync(string instance, DateTime? fromDate, DateTime? toDate)
    {
        var effectiveToDate = toDate ?? DateTime.Now;
        var effectiveFromDate = fromDate ?? DateTime.MinValue;
        return await _batterySensorRepository.FindAllByInstanceAsync(instance, effectiveToDate, effectiveFromDate);
    }

    public async Task Insert(BatterySensor batterySensor)
    {
        await _batterySensorRepository.InsertAsync(batterySensor);
    }
}